import { fromJS, List } from 'immutable';

import { secureParam } from '../common';

export default (app, db) => {
  app.get('/search/suggestions/:term', (req, res) => {
    // finds automatic suggestions ("as-you-type") for keyword searching
    const term = secureParam(req.params.term);

    const termRegex = new RegExp(term, 'gi');

    db.Song.find({ title: termRegex }, 'title artist', { limit: 5 }, (error1, songs) => {
      const suggestions = {
        songs: songs.map(song =>
          [song._id, song.title, song.artist]
        )
      };

      db.Song.find({ artist: termRegex }).distinct('artist', (error2, artists) => {
        suggestions.artists = artists.slice(0, 5).map(artist => artist);

        db.Song.find({ album: termRegex }, 'album artist', (error3, items) => {
          suggestions.albums = fromJS(items).map(item => List.of(
            item.get('album'),
            item.get('artist')
          )).toSet().take(5);

          res.json(suggestions);
        });
      });
    });
  });
};
