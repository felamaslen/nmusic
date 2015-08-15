/*
 * test web server for now (skeleton)
 */

const common = require('./common');
const config = require('./config');

const http = require('http');
const fs = require('fs');

const secureParam = param => {
  return decodeURIComponent(param.toString());
};

const compressSongs = songs => {
  // use arrays to save bandwidth on keys
  return JSON.stringify(songs.map(song => {
    return [
      song._id,
      song.track,
      song.title,
      song.artist,
      song.album,
      song.genre,
      song.time,
      song.year,
    ];
  }));
};

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
  'search/suggestions': (res, params) => {
    // finds automatic suggestions ("as-you-type") for keyword searching

    if (typeof params.term === 'undefined') {
      res.statusCode = 400;
      res.end('Error: must supply a search term!');
    }

    const term = secureParam(params.term);
    const regex = new RegExp(term, 'gi');

    Song.find({ title: regex }, 'title artist', { limit: 5 }, (error1, songs) => {
      const suggestions = {
        songs: songs.map(song => {
          return [song._id, song.title, song.artist];
        }),
      };

      Song.find({ artist: regex }).distinct('artist', (error2, artists) => {
        suggestions.artists = artists.slice(0, 5).map(artist => artist);

        Song.find({ album: regex }).distinct('album', (error3, albums) => {
          suggestions.albums = albums.slice(0, 5).map(album => album);

          res.end(JSON.stringify(suggestions));
        });
      });
    });
  },

  'list/tree': res => {
    // gets all the songs, but in an artist/album tree
    Song.find({}, 'track title artist album genre time year', (error, songs) => {
      if (error) {
        throw error;
      }

      const tree = {};

      songs.forEach(song => {
        if (typeof tree[song.artist] === 'undefined') {
          tree[song.artist] = {};
        }
        if (typeof tree[song.artist][song.album] === 'undefined') {
          tree[song.artist][song.album] = [];
        }

        tree[song.artist][song.album].push([
          song._id,
          song.track,
          song.title,
          song.genre,
          song.time,
          song.year,
        ]);
      });

      res.end(JSON.stringify(tree));
    });
  },

  'list/songs': (res, params) => {
    const query = {};

    if (typeof params.artist !== 'undefined') {
      query.artist = secureParam(params.artist);
    }
    if (typeof params.album !== 'undefined') {
      query.album = secureParam(params.album);
    }

    Song.find(query, 'track title artist album genre time year', (error, songs) => {
      if (error) {
        throw error;
      }

      res.end(compressSongs(songs));
    });
  },

  'list/albums': (res, params) => {
    const query = typeof params.artist === 'undefined' || !params.artist.length
      ? {} : { artist: secureParam(params.artist) };

    Song.find(query).distinct('album', (error, albums) => {
      if (error) {
        throw error;
      }

      res.end(JSON.stringify(albums));
    });
  },

  'list/artists': res => {
    Song.find().distinct('artist', (error, artists) => {
      if (error) {
        throw error;
      }

      res.end(JSON.stringify(artists));
    });
  },

  play: (res, params) => {
    if (typeof params.id === 'undefined') {
      res.statusCode = 400;
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
            'Accept-Ranges': 'bytes',
          });

          const readStream = fs.createReadStream(file);
          readStream.pipe(res);
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

  console.log(common.formatTime(), 'REQ', url);

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

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // we're always outputting JSON
  res.setHeader('Content-Type', 'application/json');

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
