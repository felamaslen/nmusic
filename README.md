# nmusic
Node-based music player and organiser, written using React.

### Prerequisites
* Install _nodejs_ if you haven't already
* Get access to a running _MongoDB_ server
* In `code/server/config.js`:
* 1. Set `MONGO_URL` to your particular database instance.
* 2. Set `MUSIC_DIR` to the directory containing your music files.
* 3. Set `GET_ALL_SONGS` to `false` if you have more than a couple of hundred songs.
* Create empty database: `npm run dropdb`
* Install node dependencies: `npm install`

### Usage
* Start: `npm start`
* Scan your music directory: `npm run updatedb`
