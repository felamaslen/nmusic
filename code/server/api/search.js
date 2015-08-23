import { secureParam } from '../common';

export default (app, db) => {
  app.get('/search/suggestions/:term', (req, res) => {
    // finds automatic suggestions ("as-you-type") for keyword searching
    const term = secureParam(req.params.term);

    const termRegex = new RegExp(term, 'gi');

    db.Song.find({ title: termRegex }, 'title artist', { limit: 5 }, (error1, songs) => {
      const suggestions = {
        songs: songs.map(song => {
          return [song._id, song.title, song.artist];
        })
      };

      db.Song.find({ artist: termRegex }).distinct('artist', (error2, artists) => {
        suggestions.artists = artists.slice(0, 5).map(artist => artist);

        db.Song.find({ album: termRegex }).distinct('album', (error3, albums) => {
          suggestions.albums = albums.slice(0, 5).map(album => album);

          res.json(suggestions);
        });
      });
    });
  });
};
