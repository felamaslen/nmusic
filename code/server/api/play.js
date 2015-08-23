import send from 'send';

export default (app, db) => {
  app.get('/play/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);

    // fetch song filename from database
    db.Song.findOne({ _id: id }, 'filename', (err, song) => {
      if (err) {
        res.statusCode = 500;
        res.end('Server error');
      } else {
        if (!song) {
          res.statusCode = 404;
          res.end('No such song!');
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
      }
    });
  });
};
