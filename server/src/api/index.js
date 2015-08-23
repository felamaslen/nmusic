// ==== API routes =====
import search from './search';
import list from './list';
import play from './play';

export default (app, db) => {
  // Auth test: test if a token is still valid
  app.use('/authtest', (req, res) => {
    // if the client can access this route then it has already been
    // authenticated by the middleware. Thus we can simply send a
    // "success" response :)
    res.json({
      message: 'Logged in',
      success: true
    });
  });

  // Gets search results
  search(app, db);

  // Gets songs lists (filtered by artist/album)
  list(app, db);

  // Plays songs
  play(app, db);
};

