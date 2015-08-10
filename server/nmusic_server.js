/*
 * test web server for now (skeleton)
 */

const config = require('./config');

const http = require('http');
const fs = require('fs');
const util = require('util');

// connect to database
const mongoose = require('mongoose');
mongoose.connect(config.MONGO_URL);

const db = mongoose.connection;
db.on('error', (e) => {
  console.error('Connection error:', e);
});

const schema = new mongoose.Schema(config.MUSIC_SCHEMA);
const Song = mongoose.model('song', schema);

const getMethods = {
  'list/albums': (res, params) => {
    const query = typeof params.artist === 'undefined'
      ? {} : { artist: unescape(params.artist) };

    Song.find(query).distinct('album', (error, albums) => {
      res.end(JSON.stringify(albums));
    });
  },

  'list/artists': res => {
    Song.find().distinct('artist', (error, artists) => {
      res.end(JSON.stringify(artists));
    });
  },

  play: (res, params) => {
    if (typeof params.id === 'undefined') {
      res.statusCode = 500;
      res.end('Error: must supply an ID!');
    }

    const id = params.id;

    // fetch song filename from database
    Song.findOne({ _id: id }, 'filename', (err, song) => {
      if (err) {
        res.statusCode = 404;
        res.end('File not found');
      } else {
        const file = song.filename;
        try {
          const stat = fs.statSync(file);

          const extension = file.substring(file.lastIndexOf('.') + 1);

          res.writeHead(200, {
            'Content-Type': 'audio/' + extension,
            'Content-Length': stat.size,
          });

          const readStream = fs.createReadStream(file);
          util.pump(readStream, res);
        } catch(err2) {
          res.statusCode = 500;
          res.end('Server error (bad database entry)');
        }
      }
    });
  },

  'favicon.ico': res => {
    res.statusCode = 404;
    res.end('Not found');
  },
};

const handleRequest = (req, res) => {
  const method = req.method;

  const url = req.url;

  console.log('REQ', url);

  // GET parameters (?param1=value1&param2=value2... in URL)
  const parts = url.split('?');

  const params = {};

  if (typeof parts[1] === 'string') {
    const parts2 = parts[1].split('&');

    parts2.map(part => {
      const parts3 = part.split('=');

      params[parts3[0]] = parts3[1];
    });
  }

  const path = parts[0].substring(1);

  switch (method) {
  case 'POST':
    res.status(500).end('POST not implemented');
    break;
  case 'GET':
  default:
    if (typeof getMethods[path] === 'function') {
      getMethods[path](res, params);
    } else {
      res.end('Error: undefined method!');
    }

    break;
  }

  return true;
};

const server = http.createServer(handleRequest);

// Lets start our server
server.listen(config.SERVER_PORT, () => {
  console.log('Server listening on: http://localhost:%s', config.SERVER_PORT);
});
