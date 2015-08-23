// Connect to the Mongo database
import {
  MONGO_URL,
  MUSIC_SCHEMA
} from './config';

import mongoose, { Schema } from 'mongoose';

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

export default db;
