// configuration variables

module.exports = {
  DB: {
    username: '',
    password: '',
  },
  SERVER_PORT: 3005,
  MONGO_URL: 'mongodb://localhost:27017/nmusic',
  MUSIC_DIR: '/home/fela/music',
  FORMATS: ['mp3', 'flac', 'ogg', 'm4a'],
  MUSIC_SCHEMA: {
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
