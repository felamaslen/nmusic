/**
 * config parameters for the server
 */

/**
 * MODIFY SETTINGS IN THIS SECTION ONLY
 */

// Set this to your particular MongoDB instance
export const MONGO_URL = 'mongodb://localhost:27017/nmusic';

// Set this to the folder where all your music is stored
export const MUSIC_DIR = '/home/user/music/music';

// Set this to false if you have many (>~200) songs
// or if you want less of a delay on app startup
export const GET_ALL_SONGS = true;

// This is the port on which the web server will run
export const SERVER_PORT = 8080;

export const AUTH_SECRET = 'I don\'t eat cheese';
export const COOKIE_SECRET = 'I like turtles';

/**
 * NO MODIFICATIONS BEYOND THIS POINT!
 */

export const DEFAULT_USERNAME = 'user';
export const DEFAULT_PASSWORD = 'password';

export const FORMATS = ['mp3', 'flac', 'ogg', 'm4a'];

export const DB_SCHEMA = {
  songs: {
    _id: Number,
    filename: String,
    track: Number,
    title: String,
    artist: String,
    album: String,
    genre: String,
    year: String
  },
  counters: {
    _id: String,
    seq: Number
  },
  users: {
    username: String,
    password: String,
    admin: Boolean
  }
};
