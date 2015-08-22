import { fromJS } from 'immutable';

import {
  GET_ALL_SONGS
} from '../config';

import {
  secureParam,
  compressSongs
} from '../common';

export default (app, db) => {
  // for getting songs filtered by artist or album (or both/neither)
  app.get('/list/songs/:artists?/:albums?', (req, res) => {
    // gets a song list and reloads the albums browser if necessary
    const artistChanged = typeof req.query.artistChanged &&
      req.query.artistChanged === 'true';

    const haveArtists = req.params.artists && req.params.artists.length > 0;
    const haveAlbums = req.params.albums && req.params.albums.length > 0;

    const allSongs = !haveArtists && !haveAlbums;

    if (!GET_ALL_SONGS && allSongs) {
      // if "All Artists, all albums" is selected, don't get any songs
      // this is to save bandwidth, memory and CPU time

      db.Song.find().distinct('album', (error, albums) => {
        if (error) {
          throw error;
        }

        res.json({
          songs: [],
          albums: albums,
          selectedAlbums: [-1]
        });
      });
    } else {
      const artists = haveArtists
        ? secureParam(req.params.artists).split(',').map(secureParam) : [];

      const albums = haveAlbums
        ? secureParam(req.params.albums).split(',').map(secureParam) : [];

      const query = haveArtists || (haveAlbums && !artistChanged) ? { $and: [] } : {};

      if (haveArtists) {
        query.$and.push({ $or: artists.map(artist => {
          return { artist: artist };
        }) });
      }

      if (haveAlbums && !artistChanged) {
        query.$and.push({ $or: albums.map(album => {
          return { album: album };
        }) });
      }

      db.Song.find(
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

          if (artistChanged) {
            // if an album wasn't supplied, we want to fetch a new album list
            // because it may have updated
            const browserQuery = haveArtists
            ? { $or: artists.map(artist => {
              return { artist: artist };
            }) }
            : {};

            db.Song.find(browserQuery).distinct('album', (error2, browserAlbums) => {
              if (error2) {
                throw error2;
              }

              const sortedAlbums = browserAlbums.sort();

              let selectedAlbums = [];

              const albumsList = fromJS(albums);

              fromJS(sortedAlbums).forEach((album, key) => {
                if (albumsList.indexOf(album) > -1) {
                  selectedAlbums = selectedAlbums.push(key);
                }
              });

              res.end(JSON.stringify({
                songs: compressSongs(songs, false),
                albums: browserAlbums,
                selectedAlbums: selectedAlbums.length ? selectedAlbums : [-1]
              }));
            });
          } else {
            res.end(compressSongs(songs));
          }
        }
      );
    }
  });

  // for the artists browser on first load
  app.get('/list/artists', (req, res) => {
    db.Song.find().distinct('artist', (error, artists) => {
      if (error) {
        throw error;
      }

      res.json(artists);
    });
  });

  // not used as of yet
  app.get('/list/tree', (req, res) => {
    // gets all the songs, but in an artist/album tree
    db.Song.find({}, 'track title artist album genre time year', (error, songs) => {
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

      res.json(tree);
    });
  });
};
