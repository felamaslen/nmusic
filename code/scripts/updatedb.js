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
import id3 from 'id3js';
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

const ord = string => {
  const str = string + '';
  const code = str.charCodeAt(0);
  if (code >= 0xD800 && code <= 0xDBFF) {
    const hi = code;
    if (str.length === 1) { return code; }
    const low = str.charCodeAt(1);
    return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
  }
  if (code >= 0xDC00 && code <= 0xDFFF) {
    return code;
  }
  return code;
};

const _skipID3v2Tag = block => {
  if (block.substring(0, 3) === 'ID3') {
    // const id3v2MajorVersion = ord(block[3]);
    // const id3v2MinorVersion = ord(block[4]);
    const id3v2Flags = ord(block[5]);

    // const flagUnsynchronisation = id3v2Flags & 0x80 ? 1 : 0;
    // const flagExtendedHeader = id3v2Flags & 0x40 ? 1 : 0;
    // const flagExperimentalInd = id3v2Flags & 0x20 ? 1 : 0;
    const flagFooterPresent = id3v2Flags & 0x10 ? 1 : 0;

    const z0 = ord(block[6]);
    const z1 = ord(block[7]);
    const z2 = ord(block[8]);
    const z3 = ord(block[9]);

    if (
      ((z0 & 0x80) === 0) &&
      ((z1 & 0x80) === 0) &&
      ((z2 & 0x80) === 0) &&
      ((z3 & 0x80) === 0)
    ) {
      const headerSize = 10;
      const tagSize = ((z0 & 0x7f) * 2097152) + ((z1 & 0x7f) * 16384)
        + ((z2 & 0x7f) * 128) + (z3 & 0x7f);
      const footerSize = flagFooterPresent ? 10 : 0;
      return headerSize + tagSize + footerSize;
    }

    return 0;
  }
};

const _frameSize = (layer, bitRate, sampleRate, paddingBit) => {
  return layer === '1'
    ? parseInt(((12 * bitRate * 1000 / sampleRate) + paddingBit) * 4, 10)
    : parseInt(((144 * bitRate * 1000 / sampleRate) + paddingBit), 10);
};

const _parseFrameHeader = fourBytes => {
  const versions = [
    [0x0, '2.5'],
    [0x1, 'x'],
    [0x2, '2'],
    [0x3, '1']
  ];
  const layers = [
    [0x0, 'x'],
    [0x1, '3'],
    [0x2, '2'],
    [0x3, '1']
  ];
  const bitrates = {
    V1L1: [0, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448],
    V1L2: [0, 32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384],
    V1L3: [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320],
    V2L1: [0, 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256],
    V2L2: [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160],
    V2L3: [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160]
  };
  const sampleRates = [
    ['1', [44100, 48000, 32000]],
    ['2', [22050, 24000, 16000]],
    ['2.5', [11025, 12000, 8000]]
  ];
  const samples = [
    [1, [[1, 384], [2, 1152], [3, 1152]]],  // MPEGv1,     Layers 1, 2,3
    [2, [[1, 384], [2, 1152], [3, 576]]]    // MPEGv2/2.5, Layers 1, 2,3
  ];
  const b1 = ord(fourBytes[1]);
  const b2 = ord(fourBytes[2]);
  // const b3 = ord(fourBytes[3]);

  const versionBits = (b1 & 0x18) >> 3;
  const versionsFiltered = versions.filter(item => item[0] === versionBits);
  if (!versionsFiltered.length) {
    return 'Invalid version';
  }

  const version = versionsFiltered[0][1].toString();
  const simpleVersion = parseInt((version === '2.5' ? 2 : version), 10);

  const layerBits = (b1 & 0x06) >> 1;
  const layersFiltered = layers.filter(item => item[0] === layerBits);
  if (!layersFiltered.length) {
    return 'Invalid layer';
  }

  const layer = parseInt(layersFiltered[0][1], 10);

  // const protectionBit = (b1 & 0x01);
  const bitrateKey = 'V' + simpleVersion.toString() + 'L' + layer.toString();
  // const bitrateKey = `V${simpleVersion}L${layer}`;
  const bitrateIdx = (b2 & 0xf0) >> 4;
  const bitrate = bitrates[bitrateKey] && bitrates[bitrateKey][bitrateIdx]
    ? bitrates[bitrateKey][bitrateIdx] : 0;

  const sampleRateIdx = (b2 & 0x0c) >> 2;
  const sampleRateFiltered = sampleRates.filter(item => item[0] === version);
  if (!sampleRateFiltered.length) {
    return 'Invalid sample rate';
  }

  const sampleRate = sampleRateFiltered[0][1][sampleRateIdx] || 0;
  const paddingBit = (b2 & 0x02) >> 1;
  // const privateBit = (b2 & 0x01);
  // const channelModeBits = (b3 & 0xc0) >> 6;
  // const modeExtensionBits = (b3 & 0x30) >> 4;
  // const copyrightBit = (b3 & 0x08) >> 3;
  // const originalBit = (b3 & 0x04) >> 2;
  // const emphasis = (b3 & 0x03);

  const info = [];

  info.version = version;// MPEGVersion
  info.layer = layer;
  // info.Protection Bit = protection_bit; //0=> protected by 2 byte CRC, 1=>not protected
  info.bitRate = bitrate;
  info.sampleRate = sampleRate;
  // info.PaddingBit = paddingBit;
  // info.PrivateBit = privateBit;
  // info.ChannelMode = channelModeBits;
  // info.Mode Extension = modeExtensionBits;
  // info.Copyright = copyrightBit;
  // info.Original = originalBit;
  // info.Emphasis = emphasis;
  info.frameSize = _frameSize(layer, bitrate, sampleRate, paddingBit);

  const samplesFiltered = samples.filter(item => item[0] === simpleVersion);
  if (!samplesFiltered.length) {
    return 'Invalid sample version';
  }

  const samplesFilteredAgain = samplesFiltered[0][1].filter(
    item => item[0] === layer
  );
  if (!samplesFilteredAgain.length) {
    return 'Invalid layer for sample version';
  }

  info.samples = samplesFilteredAgain[0][1];

  return info;
};

const getDuration = (file, estimate, callback) => {
  const fileSize = fs.statSync(file).size;

  fs.open(file, 'r', (status, fd) => {
    if (status) {
      throw status.message;
    }

    // this will be the actual duration of the song
    let duration = 0;

    // find where in the file the actual audio data starts
    const offsetBuffer = new Buffer(100);
    fs.readSync(fd, offsetBuffer, 0, 100, null);

    let offset = _skipID3v2Tag(offsetBuffer.toString('binary'));

    const raw = new Buffer(10);

    const _processRaw = buffer => {
      let ended = false;

      let info;

      // looking for 1111 1111 11 (frame synchronisation bits)
      const block = buffer.toString('binary');

      if (block[0] === '\xff' && (ord(block[1]) & 0xe0)) {
        info = _parseFrameHeader(buffer.toString('binary').substring(0, 4));

        if (typeof info === 'string') {
          // something bad happened
          callback(info, null);
          ended = true;
        } else {
          if (!info.frameSize) {
            // corrupt MP3 file
            callback(false, duration);
            ended = true;
          } else {
            offset += info.frameSize - 10;
            duration += info.samples / info.sampleRate;
          }
        }
      } else if (block.substring(0, 3) === 'TAG') {
        offset += 128 - 10;
      } else {
        offset -= 9;
      }

      if (estimate && !!info && !ended) {
        const kbps = (info.bitRate * 1000) / 8;
        const dataSize = fileSize - offset;

        callback(false, dataSize / kbps);

        ended = true;
      }

      return ended;
    };

    // now read the file byte by byte
    const fread = () => {
      fs.read(fd, raw, 0, raw.length, offset, (err, bytesRead, buffer) => {
        const eof = bytesRead !== raw.length;
        if (!eof) {
          if (!_processRaw(buffer)) {
            fread();
          }
        } else {
          if (bytesRead > 0) {
            _processRaw(buffer.slice(0, bytesRead));
          }
          fs.close(fd);

          callback(false, duration);
        }

        offset += 10;
      });
    };

    fread();
  });
};

const trimDud = string => string && string.replace(/\0/g, '') || '';

const processTags = (tags, filename, duration) => {
  const title = trimDud(tags.title);
  const artist = trimDud(tags.artist);
  const album = trimDud(tags.album);
  const year = trimDud(tags.year);

  const haveV1 = !!tags.v1;
  const haveV2 = !!tags.v2;

  const trackV1 = haveV1 ? tags.v1.track : 0;
  const genreV1 = haveV1 ? tags.v1.genre : '';

  const track = getTrackNo(haveV2 && tags.v2.track ? tags.v2.track : trackV1);
  const genre = trimDud(
    haveV2 && tags.v2.genre ? tags.v2.genre : genreV1
  );

  return { filename, track, title, artist, album, genre, duration, year };
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

const processFile = (next, files, total, ended, tags) => {
  const info = {
    filename: tags.filename,
    track: tags.track,
    title: tags.title.toString(),
    artist: tags.artist.toString(),
    album: tags.album.toString(),
    genre: tags.genre.toString(),
    time: tags.duration,
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

    getDuration(file, false, (durationError, duration) => {
      if (durationError) {
        console.log('[ERROR]', durationError, file);

        // don't stop the script because of one bad file
        next(missingFiles, total, ended);
      } else {
        id3({ file: file, type: id3.OPEN_LOCAL }, (error, _tags) => {
          if (error) {
            throw error;
          }

          const tags = processTags(_tags, file, duration);

          processFile(next, missingFiles, total, ended, tags);
        });
      }
    });
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
    const file = extraneous.pop();

    Song.remove({ filename: file }, error => {
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
    files.length, 'Processing missing files', true
  );

  addMissing(
    files,
    files.length,
    afterAddMissing,
    nextMissingTrack
  );
};

const dbScanned = (files, error, _dbFiles) => {
  if (error) {
    throw error;
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

