/**
 * 2015, Fela Maslen
 */

const config = require('./config');

// connect to database
const mongoose = require('mongoose');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));

// const id3 = require('id3js');
const mm = require('musicmetadata');
const fs = require('fs');

const startTime = new Date().getTime();
const execTimes = [];
const execTime = (name, fromStart) => {
  const time = new Date().getTime();

  const thisTime = fromStart || !execTimes.length
    ? time - startTime : time - execTimes[execTimes.length - 1][0];

  execTimes.push([time, ['  ' + name + ':', Math.round(thisTime) / 1000 + 's']]);

  return true;
};

const formatTime = () => {
  const date = new Date();

  const yyyy = date.getFullYear().toString();
  const mm_ = (date.getMonth() + 1).toString(); // getMonth() is zero-based
  const dd = date.getDate().toString();

  const HH = date.getHours().toString();
  const MM = date.getMinutes().toString();
  const SS = date.getSeconds().toString();

  return yyyy + '-' + (mm_[1] ? mm_ : '0' + mm_[0]) + '-'
    + (dd[1] ? dd : '0' + dd[0]) + ' '
    + HH + ':' + MM + ':' + SS;
};

const basename = filename => {
  return filename.substring(filename.lastIndexOf('/') + 1);
};

const logProcess = (msg) => {
  console.log('[' + formatTime() + ']', msg);
};

const getFilenames = item => { return item.filename; };

const inArray = (needle, haystack) => {
  for (key in haystack) {
    if (haystack[key] === needle) {
      return true;
    }
  }
  return false;
};

const inArraySubkey = (needle, haystack, subkey) => {
  for (key in haystack) {
    if (haystack[key][subkey] === needle) {
      return true;
    }
  }
  return false;
};

const arrayDiffSubkey = (array1, array2, subkey) => {
  const diff = [];
  array1.forEach(item => {
    if (!inArraySubkey(item[subkey], array2, subkey)) {
      diff.push(item);
    }
  });

  return diff;
};

const addDirRecursive = (dir, badFiles) => {
  const _files = fs.readdirSync(dir);
  const files = [];

  _files.forEach(file => {
    const path = dir + '/' + file;

    if (!inArray(path, badFiles)) {
      if (fs.lstatSync(path).isDirectory()) {
        const files_ = addDirRecursive(path, badFiles);
        files_.forEach(obj => {
          files.push(obj);
        });
      } else {
        const extension = path.substring(path.lastIndexOf('.') + 1);

        if (inArray(extension, config.FORMATS)) {
          files.push({ filename: path });
        }
      }
    }
  });

  return files;
};

const schema = {
  badFiles: new mongoose.Schema({
    filename: String,
  }),

  songs: new mongoose.Schema({
    filename: String,
    track: Number,
    title: String,
    artist: String,
    album: String,
    genre: String,
    time: Number, // seconds
    year: Number,
  }),
};

const BadFile = mongoose.model('badfile', schema.badFiles);

const Song = mongoose.model('song', schema.songs);

const addMissing = (missingFiles, total, callback) => {
  if (missingFiles.length > 0) {
    const doc = missingFiles.pop();

    mm(fs.createReadStream(doc.filename), { duration: true }, (err, tags) => {
      if (err) throw err;

      const track = typeof tags.track === 'object' && typeof tags.track.no === 'number' ? tags.track.no : 0;
      const title = typeof tags.title !== 'undefined' ? tags.title : 'Untitled Track';

      const artist0 = typeof tags.albumartist === 'object' ? tags.albumartist[0] : 'Unknown Artist';
      const artist = typeof tags.artist === 'object' ? tags.artist[0] : artist0;

      const album = typeof tags.album !== 'undefined' ? tags.album : '';
      const genre = typeof tags.genre === 'object' ? tags.genre[0] : '';
      const time = typeof tags.duration !== 'undefined' ? parseFloat(tags.duration, 10) : 0;
      const year = typeof tags.year !== 'undefined' ? parseInt(tags.year, 10) : 0;

      const item = new Song({
        filename: doc.filename,
        track: track,
        title: title,
        artist: artist,
        album: album,
        genre: genre,
        time: time,
        year: year,
      });

      item.save(err2 => {
        if (err2) throw err2;

        const progress = '[' + Math.round((total - missingFiles.length) / total * 100, 2).toString() + '%]';
        console.log(progress, 'Processed', basename(doc.filename));

        addMissing(missingFiles, total, callback);
      });
    });
  } else {
    callback();
  }
};

const removeExtraneous = (extraneous, callback) => {
  if (extraneous.length > 0) {
    const doc = extraneous.pop();

    Song.remove({ _id: doc._id }, err => {
      if (err) {
        throw err;
      }

      if (extraneous.length > 0) {
        removeExtraneous(extraneous, callback);
      } else {
        callback();
      }
    });
  } else {
    callback();
  }
};

const _onDBOpen = () => {
  logProcess('Finding bad files...');
  BadFile.find({}, (err1, badFiles) => {
    if (err1) {
      throw err1;
    }
    execTime('Fetch bad files cache');

    const _badFiles = badFiles.map(getFilenames);

    // find all files in the filesystem
    logProcess('Recursing through ' + config.MUSIC_DIR + '...');
    const files = addDirRecursive(config.MUSIC_DIR, _badFiles);
    execTime('Scan music directory (' + files.length + ' files)');

    // find all entries in the DB
    logProcess('Looking through database...');
    Song.find({}, { filename: true }, (err2, dbFiles) => {
      if (err2) {
        throw err2;
      }
      execTime('Fetch all songs from DB (' + dbFiles.length + ' items)');

      // things in the filesystem not in DB
      logProcess('Calculating missing files...');
      const missingFiles = arrayDiffSubkey(files, dbFiles, 'filename');
      execTime('Find missing files (' + missingFiles.length + ' items)');

      // things in DB which no longer exist in filesystem
      logProcess('Calculating extraneous db entries...');
      const extraneous = arrayDiffSubkey(dbFiles, files, 'filename');
      execTime('Find extraneous db entries (' + extraneous.length + ' items)');

      logProcess('Removing extraneous db entries...');
      removeExtraneous(extraneous, () => {
        execTime('Remove extraneous db entries');

        logProcess('Processing missing files...');
        addMissing(missingFiles, missingFiles.length, () => {
          execTime('Process missing files');

          // show execution times for each process, at the end of the script
          execTime('Total', true);
          console.log('Exec times:');
          execTimes.forEach(time => {
            console.log(time[1][0], time[1][1]);
          });

          process.exit();
        });
      });
    });
  });
};

logProcess('Starting updatedb process...');

db.once('open', _onDBOpen);

mongoose.connect(config.MONGO_URL);

