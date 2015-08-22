// ==== API routes =====
import search from './search';
import list from './list';
import play from './play';

export default (app, db) => {
  // Gets search results
  search(app, db);

  // Gets songs lists (filtered by artist/album)
  list(app, db);

  // Plays songs
  play(app, db);
};

