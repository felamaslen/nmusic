// Clears the music database and fills it with blank data
// Think of this as a "factory reset"

import {
  MONGO_URL,
  DB_SCHEMA,
  DEFAULT_USERNAME,
  DEFAULT_PASSWORD
} from '../server/config';

import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));

const Song = mongoose.model('song', new Schema(DB_SCHEMA.songs));
const Counter = mongoose.model('counter', new Schema(DB_SCHEMA.counters));

const User = mongoose.model('user', new Schema(DB_SCHEMA.users).index(
  { username: 1 }, { unique: true })
);

const insertSongsCounter = () => {
  const songsCounter = new Counter({
    _id: 'songsid',
    seq: 0
  });

  songsCounter.save(errorSavingCounter => {
    if (errorSavingCounter) {
      throw errorSavingCounter;
    }

    console.log('Successfully reset the database to its default state.');
    mongoose.disconnect();
  });
};

const insertDefaultUser = () => {
  const defaultUser = new User({
    username: DEFAULT_USERNAME,
    password: bcrypt.hashSync(DEFAULT_PASSWORD, 10),
    admin: true
  });

  defaultUser.save(errorSavingNewUser => {
    if (errorSavingNewUser) {
      throw errorSavingNewUser;
    }

    insertSongsCounter();
  });
};

const clearExistingData = () => {
  // clear existing data
  Song.remove({}, e1 => {
    if (e1) { throw e1; }
    Counter.remove({}, e2 => {
      if (e2) { throw e2; }
      User.remove({}, e3 => {
        if (e3) { throw e3; }

        insertDefaultUser();
      });
    });
  });
};

const init = () => {
  clearExistingData();
};

db.once('open', init);

mongoose.connect(MONGO_URL);

