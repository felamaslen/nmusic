// configuration variables

export const SERVER_PORT = 3005;
export const MONGO_URL = 'mongodb://localhost:27017/nmusic';
export const GET_ALL_SONGS = true;
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
export const SUPERSECRET = 'I don\'t eat cheese';
