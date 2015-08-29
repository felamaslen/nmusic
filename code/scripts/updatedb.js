/**
 * 2015, Fela Maslen
 */

import { formatTime } from '../server/common';
import {
  FORMATS,
  MONGO_URL as CONFIG_MONGO_URL,
  DB_SCHEMA,
  MUSIC_DIR as CONFIG_MUSIC_DIR
} from '../server/config';

import fs from 'fs';
import ffmetadata from 'ffmetadata';
import mongoose, { Schema } from 'mongoose';
import ProgressBar from 'progress';

// environment variable overrides
const MONGO_URL = process.env.MONGO_URL || CONFIG_MONGO_URL;
const MUSIC_DIR = process.env.MUSIC_DIR || CONFIG_MUSIC_DIR;

/* DATABASE */
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));

const startTime = new Date().getTime();
const execTimes = [];

// handle counters
const findAndModify = (scope, query, sort, doc, options, callback) => {
  scope.collection.findAndModify(query, sort, doc, options, callback);
};

const Counter = mongoose.model('counter', new Schema(DB_SCHEMA.counters));
const Song = mongoose.model('song', new Schema(DB_SCHEMA.songs));
/* END DATABASE */

/* GENERAL FUNCTIONS */
const arrayDiff = (array1, array2, progressBar) => {
  // returns the subset of array1 such that every element
  // is not in array2
  return array1.filter(item => {
    progressBar.tick();
    return array2.indexOf(item) === -1;
  });
};

const getTrackNo = track => {
  return track && track.split ? parseInt(track.split('/')[0], 10) : 0;
};

const trimDud = (string, fallback) => string && string.replace(/\0/g, '') || fallback;

const processTags = (tags, filename) => {
  const track = getTrackNo(trimDud(tags.track, '0'));
  const title = trimDud(tags.title, 'Untitled Track');
  const artist = trimDud(tags.artist, 'Unknown Artist');
  const album = trimDud(tags.album, 'Unknown Album');
  const genre = trimDud(tags.genre, '');
  const year = trimDud(tags.date, '');

  return { filename, track, title, artist, album, genre, year };
};
/* END GENERAL FUNCTIONS */

/* PROGRESS INFO */
const execTime = (name, fromStart) => {
  const time = new Date().getTime();

  const thisTime = fromStart || !execTimes.length
    ? time - startTime : time - execTimes[execTimes.length - 1][0];

  execTimes.push([time, ['  ' + name + ':', Math.round(thisTime) / 1000 + 's']]);

  return true;
};

const logProcess = (msg) => {
  console.log(`[${formatTime()}]`, msg);
};

// progress bars
let progressbarDirscan;
let progressbarMissingFiles;
let progressbarExtraneous;
let progressbarRemoveExtraneous;
let progressbarProcessFiles;

// warnings
const fileWarnings = [];

const CustomProgressBar = (total, title, displayCurrent) => {
  return new ProgressBar(
    displayCurrent
      ? `[:bar] ${title} (:current/:total) ETA: :etas`
      : `[:bar] ${title} (:percent) ETA: :etas`,
    {
      total: total,
      width: 19,
      complete: '>',
      incomplete: '-'
    }
  );
};
/* END PROGRESS INFO */

/* CALLBACK FUNCTIONS */
const getNextSongId = (name, callback) => {
  findAndModify(
    Counter,
    { _id: name },
    [],
    { $inc: { seq: 1 } },
    { new: true },
    (errorGetID, counter) => {
      if (errorGetID) {
        throw errorGetID;
      }

      callback(counter.value.seq);
    }
  );
};

const saveNewSong = (info, next, files, total, ended, id) => {
  const _info = info;
  _info._id = id;

  const item = new Song(_info);
  item.save(errorSaveSong => {
    if (errorSaveSong) {
      fileWarnings.push(_info.filename);
    }

    progressbarProcessFiles.tick();

    next(files, total, ended);
  });
};

const processFile = (next, files, total, ended, tags) => {
  const info = {
    filename: tags.filename,
    track: tags.track,
    title: tags.title.toString(),
    artist: tags.artist.toString(),
    album: tags.album.toString(),
    genre: tags.genre.toString(),
    year: tags.year
  };

  if (isNaN(info.track)) { info.track = 0; }
  if (isNaN(info.time)) { info.time = 0; }

  getNextSongId('songsid', saveNewSong.bind(
    null, info, next, files, total, ended
  ));
};

const addMissing = (missingFiles, total, ended, next) => {
  if (missingFiles.length > 0) {
    const file = missingFiles.pop();

    try {
      ffmetadata.read(file, (errorTagRead, _tags) => {
        if (errorTagRead) {
          fileWarnings.push(file);

          next(missingFiles, total, ended);
        } else {
          const tags = processTags(_tags, file);

          processFile(next, missingFiles, total, ended, tags);
        }
      });
    } catch (tagError) {
      fileWarnings.push(file);
    }
  } else {
    ended();
  }
};

const afterAddMissing = () => {
  execTime('Process missing files');

  // show execution times for each process, at the end of the script
  execTime('Total', true);
  console.log('Exec times:');
  execTimes.forEach(time => {
    console.log(time[1][0], time[1][1]);
  });

  console.log(
    `Successfully updated the music database (${fileWarnings.length} ` +
      `warning${fileWarnings.length === 1 ? '' : 's'}).`
  );
  mongoose.disconnect();
};

const nextMissingTrack = (files, total, ended) => {
  addMissing(files, total, ended, nextMissingTrack);
};

const removeExtraneous = (extraneous, callback) => {
  if (extraneous.length > 0) {
    const file = extraneous.pop();

    Song.remove({ filename: file }, errorRemoveSong => {
      if (errorRemoveSong) {
        throw errorRemoveSong;
      }

      progressbarRemoveExtraneous.tick();

      if (extraneous.length > 0) {
        removeExtraneous(extraneous, callback);
      } else {
        callback();
        execTime('Remove extraneous db entries');
      }
    });
  } else {
    callback();
  }
};

const addFilesToDB = files => {
  progressbarProcessFiles = new CustomProgressBar(
    files.length, 'Processing missing files', true
  );

  addMissing(
    files,
    files.length,
    afterAddMissing,
    nextMissingTrack
  );
};

const dbScanned = (files, errorScanDB, _dbFiles) => {
  if (errorScanDB) {
    throw errorScanDB;
  }
  execTime(`Fetch all songs from DB (${_dbFiles.length} items)`);

  const dbFiles = _dbFiles.map(file => file.filename);

  // things in the filesystem not in DB
  let missingFiles;
  if (dbFiles.length > 0) {
    progressbarMissingFiles = new CustomProgressBar(
      files.length, 'Calculating missing files'
    );

    missingFiles = arrayDiff(files, dbFiles, progressbarMissingFiles);

    execTime(`Find missing files (${missingFiles.length} items)`);
  } else {
    missingFiles = files;
  }

  // things in DB which no longer exist in filesystem
  progressbarExtraneous = new CustomProgressBar(
    dbFiles.length, 'Calculating extraneous db entries'
  );

  const extraneous = arrayDiff(dbFiles, files, progressbarExtraneous);

  execTime(`Find extraneous db entries (${extraneous.length} items)`);

  progressbarRemoveExtraneous = new CustomProgressBar(
    extraneous.length, 'Removing extraneous db entries'
  );

  removeExtraneous(
    extraneous,
    addFilesToDB.bind(null, missingFiles)
  );
};

const filesScanned = files => {
  execTime(`Scan music directory (${files.length} files)`);

  // find all entries in the DB
  logProcess('Looking through database...');
  Song.find({}, { filename: true }, dbScanned.bind(null, files));
};

const addDirRecursive = (dir, level, callback) => {
  const filenames = fs.readdirSync(dir);
  const out = [];

  if (!!filenames) {
    filenames.forEach(filename => {
      const path = `${dir}/${filename}`;

      if (fs.lstatSync(path).isDirectory()) {
        addDirRecursive(path, level + 1, files => {
          files.forEach(file => out.push(file));
        });
      } else {
        const extension = filename.substring(filename.lastIndexOf('.') + 1);

        if (FORMATS.indexOf(extension) > -1) {
          out.push(path);
        }
      }

      if (!level) {
        progressbarDirscan.tick();
      }
    });

    if (callback) {
      callback(out);
    }
  }
};
/* END CALLBACK FUNCTIONS */

const getNumFiles = () => fs.readdirSync(MUSIC_DIR).length;

const _onDBOpen = () => {
  // find all files in the music directory
  progressbarDirscan = new CustomProgressBar(
    getNumFiles(), `Recursing through ${MUSIC_DIR}`
  );

  addDirRecursive(MUSIC_DIR, 0, filesScanned);
};

logProcess('Starting updatedb process...');

db.once('open', _onDBOpen);

mongoose.connect(MONGO_URL);

