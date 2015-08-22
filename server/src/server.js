import {
  MONGO_URL,
  SERVER_PORT,
  MUSIC_SCHEMA
} from './config';

import express, { Router as router } from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import mongoose, { Schema } from 'mongoose';

// connect to database
mongoose.connect(MONGO_URL);

const db = {};

db.connection = mongoose.connection;

db.connection.on('error', (error) => {
  console.error('Database connection error:', error);
});

db.model = {
  Song: mongoose.model('song', new Schema(MUSIC_SCHEMA)),
  User: mongoose.model('user', new Schema({
    username: String,
    password: String,
    admin: Boolean
  }))
};

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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
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

// Lets start our server
app.listen(SERVER_PORT);
console.log('Server listening on: http://localhost:%s', SERVER_PORT);
