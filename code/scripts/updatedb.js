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

import mm from 'musicmetadata';
import fs from 'fs';
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
const inArraySubkey = (needle, haystack, subkey) => {
  for (const key in haystack) {
    if (haystack[key][subkey] === needle) {
      return true;
    }
  }
  return false;
};

const arrayDiffSubkey = (array1, array2, subkey, progressbar) => {
  const diff = [];
  array1.forEach(item => {
    if (!inArraySubkey(item[subkey], array2, subkey)) {
      diff.push(item);
    }
    progressbar.tick();
  });

  return diff;
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

const CustomProgressBar = (total, title) => {
  return new ProgressBar(
    `[:bar] ${title} (:percent) ETA: :etas`,
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
    (error, counter) => {
      if (error) { throw error; }

      callback(counter.value.seq);
    }
  );
};

const saveNewSong = (info, next, files, total, ended, id) => {
  const _info = info;
  _info._id = id;

  const item = new Song(_info);
  item.save(error => {
    if (error) throw error;

    progressbarProcessFiles.tick();

    next(files, total, ended);
  });
};

const processFile = (doc, next, files, total, ended, error, tags) => {
  if (error) {
    // if one file has an error, skip it and move on to the next (give a warning)
    fileWarnings.push(doc.filename);

    progressbarProcessFiles.tick();
    next(files, total, ended);
  } else {
    const albumartist = tags.albumartist && tags.albumartist[0]
      ? tags.albumartist[0] : 'Unknown Artst';

    const info = {
      filename: doc.filename,
      track: tags.track && tags.track.no ? tags.track.no : 0,
      title: tags.title ? tags.title : 'Untitled Track',
      artist: tags.artist && tags.artist[0] ? tags.artist[0] : albumartist,
      album: tags.album ? tags.album : '',
      genre: tags.genre && tags.genre[0] ? tags.genre[0] : '',
      time: tags.duration ? parseFloat(tags.duration, 10) : 0,
      year: tags.year ? parseInt(tags.year, 10) : 0
    };

    getNextSongId('songsid', saveNewSong.bind(
      null, info, next, files, total, ended
    ));
  }
};

const addMissing = (missingFiles, total, ended, next) => {
  if (missingFiles.length > 0) {
    const doc = missingFiles.pop();

    // mm <-> musicmetadata
    mm(
      fs.createReadStream(doc.filename),
      { duration: true }, // get the duration of the song
      processFile.bind(null, doc, next, missingFiles, total, ended)
    );
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
    `Successfully updated the music database (${fileWarnings.length} warnings).`
  );
  mongoose.disconnect();
};

const nextMissingTrack = (files, total, ended) => {
  addMissing(files, total, ended, nextMissingTrack);
};

const removeExtraneous = (extraneous, callback) => {
  if (extraneous.length > 0) {
    const doc = extraneous.pop();

    Song.remove({ _id: doc._id }, error => {
      if (error) {
        throw error;
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
    files.length, 'Processing missing files'
  );

  addMissing(
    files,
    files.length,
    afterAddMissing,
    nextMissingTrack
  );
};

const dbScanned = (files, error, dbFiles) => {
  if (error) {
    throw error;
  }
  execTime(`Fetch all songs from DB (${dbFiles.length} items)`);

  // things in the filesystem not in DB
  progressbarMissingFiles = new CustomProgressBar(
    files.length, 'Calculating missing files'
  );

  const missingFiles = arrayDiffSubkey(
    files, dbFiles, 'filename', progressbarMissingFiles
  );

  execTime(`Find missing files (${missingFiles.length} items)`);

  // things in DB which no longer exist in filesystem
  progressbarExtraneous = new CustomProgressBar(
    dbFiles.length, 'Calculating extraneous db entries'
  );

  const extraneous = arrayDiffSubkey(
    dbFiles, files, 'filename', progressbarExtraneous
  );

  execTime(`Find extraneous db entries (${extraneous.length} items)`);

  progressbarRemoveExtraneous = new CustomProgressBar(
    extraneous.length, 'Removing extraneous db entries'
  );

  removeExtraneous(extraneous, addFilesToDB.bind(null, missingFiles));
};

const filesScanned = files => {
  execTime(`Scan music directory (${files.length} files)`);

  // find all entries in the DB
  logProcess('Looking through database...');
  Song.find({}, { filename: true }, dbScanned.bind(null, files));
};

const addDirRecursive = (dir, level, callback) => {
  const _files = fs.readdirSync(dir);
  if (!!_files) {
    const files = [];

    _files.forEach(file => {
      const path = dir + '/' + file;

      if (fs.lstatSync(path).isDirectory()) {
        addDirRecursive(path, level + 1, files_ => {
          files_.forEach(obj => files.push(obj));
        });
      } else {
        const extension = path.substring(path.lastIndexOf('.') + 1);

        if (FORMATS.indexOf(extension) > -1) {
          files.push({ filename: path });
        }
      }

      if (!level) {
        progressbarDirscan.tick();
      }
    });

    if (callback) {
      callback(files);
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

