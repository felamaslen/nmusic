import {
  SERVER_PORT
} from './config';

import express, { Router as router } from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';

// Connect to database
import db from './db';

// Initiate new Express server instance
const app = express();

const apiRouter = router();

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// default headers
app.all('/*', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  return next();
});

// Authentication
import auth from './auth';
auth(app, db.model, [apiRouter]);

// require the API
import api from './api';
api(apiRouter, db.model);

app.use('/api', apiRouter);

app.get('/', (req, res) => {
  res.send('Hello! Go to /api');
});

// Start the Express server
app.listen(SERVER_PORT);
console.log('Server listening on: http://localhost:%s', SERVER_PORT);
