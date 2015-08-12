const path = require('path');
const express = require('express');
const logger = require('morgan');

const CORDOVA_WWW_ROOT = path.join(__dirname, '../cordova/www');

const app = express();
const server = require('http').createServer(app);

app.use(logger('dev'));

// static files
app.use(express.static(CORDOVA_WWW_ROOT));

// error handler
/*
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err,
  });
});
*/

server.listen(process.env.PORT || 3000);
