// configuration variables

module.exports = {
  DB: {
    username: '',
    password: '',
  },
  SERVER_PORT: 3005,
  MONGO_URL: 'mongodb://localhost:27017/nmusic',
  GET_ALL_SONGS: false,
  MUSIC_DIR: '/home/fela/music',
  FORMATS: ['mp3', 'flac', 'ogg', 'm4a'],
  MUSIC_SCHEMA: {
    _id: Number,
    filename: String,
    track: Number,
    title: String,
    artist: String,
    album: String,
    genre: String,
    time: Number, // seconds
    year: Number,
  },
};
