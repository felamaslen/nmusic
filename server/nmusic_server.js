/*
 * test web server for now (skeleton)
 */

const common = require('./common');
const config = require('./config');

const http = require('http');
const send = require('send');

const secureParam = param => {
  return decodeURIComponent(param.toString());
};

const compressSongs = (songs, json) => {
  // use arrays to save bandwidth on keys
  const _songs = songs.map(song => {
    return [
      song._id,
      song.track,
      song.title,
      song.artist,
      song.album,
      song.genre,
      song.time,
      song.year
    ];
  });

  return typeof json === 'undefined' || json === true ? JSON.stringify(_songs) : _songs;
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
        })
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
          song.year
        ]);
      });

      res.end(JSON.stringify(tree));
    });
  },

  'list/songs': (res, params) => {
    // gets a song list and reloads the albums browser if necessary

    const haveArtist = params.artist && params.artist.length > 0;
    const haveAlbum = params.album && params.album.length > 0;

    const allSongs = !haveArtist && !haveAlbum;

    if (!config.GET_ALL_SONGS && allSongs) {
      // if "All Artists, all albums" is selected, don't get any songs
      // this is to save bandwidth, memory and CPU time

      Song.find().distinct('album', (error, albums) => {
        if (error) {
          throw error;
        }

        res.end(JSON.stringify({
          songs: [],
          albums: albums
        }));
      });
    } else {
      const artists = haveArtist ? secureParam(params.artist).split(',') : [];
      const albums = haveAlbum ? secureParam(params.album).split(',') : [];

      const query = haveArtist || haveAlbum ? { $and: [] } : {};

      if (haveArtist) {
        query.$and.push({ $or: artists.map(artist => {
          return { artist: artist };
        }) });
      }

      if (haveAlbum) {
        query.$and.push({ $or: albums.map(album => {
          return { album: album };
        }) });
      }

      Song.find(
        query,
        'track title artist album genre time year',
        {
          sort: {
            artist: 1,
            album: 1,
            track: 1,
            title: 1
          }
        },
        (error, songs) => {
          if (error) {
            throw error;
          }

          if (!haveAlbum) {
            // if an album wasn't supplied, we want to fetch a new album list
            // because it may have updated
            const browserQuery = haveArtist
            ? { $or: artists.map(artist => {
              return { artist: artist };
            }) }
            : {};

            Song.find(browserQuery).distinct('album', (error2, browserAlbums) => {
              if (error2) {
                throw error2;
              }

              res.end(JSON.stringify({
                songs: compressSongs(songs, false),
                albums: browserAlbums.sort()
              }));
            });
          } else {
            res.end(compressSongs(songs));
          }
        }
      );
    }
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

  play: (res, params, req) => {
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
          const uri = encodeURIComponent(file);

          send(req, uri, {root: '/'})
            .on('error', error => {
              res.statusCode = error.status || 500;
              res.end(error.message);
            })
            .on('directory', () => {
              res.statusCode = 403;
              res.end('Forbidden');
            })
            .pipe(res);
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
  }
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
      getMethods[path](res, params, req);
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
