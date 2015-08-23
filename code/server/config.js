/**
 * config parameters for the server
 */

/* You can modify these settings */
// Set this to false if you have many (>~200) songs
// or if you want less of a delay on app startup
export const GET_ALL_SONGS = true;

export const SERVER_PORT = 8080;

export const AUTH_SECRET = 'I don\'t eat cheese';
export const COOKIE_SECRET = 'I like turtles';
/* Don't modify anything beyond here */

export const MONGO_URL = 'mongodb://localhost:27017/nmusic';
export const MUSIC_DIR = '/home/fela/music';
export const FORMATS = ['mp3', 'flac', 'ogg', 'm4a'];
export const MUSIC_SCHEMA = {
  _id: Number,
  filename: String,
  track: Number,
  title: String,
  artist: String,
  album: String,
  genre: String,
  time: Number,
  year: Number
};
