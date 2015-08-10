/*
 * test web server for now (skeleton)
 */

const config = require('./config');

const http = require('http');

// connect to database
const mongoose = require('mongoose');
mongoose.connect(config.MONGO_URL);

const db = mongoose.connection;
db.on('error', (e) => {
  console.error('Connection error:', e);
});

const getMethods = {
  play: (res, params) => {
    console.log(res);
    if (typeof params.id === 'undefined') {
      res.statusCode = 500;
      res.end('Error: must supply an ID!');
    }

    const id = params.id;

    res.end('Playing file #' + id.toString());
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
