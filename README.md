# nmusic
Node-based music player and organiser, written using React.

### Prerequisites
* Install nodejs

## Server

### Prerequisites
* Install node dependencies: `npm install`
* Set your music directory, port etc. in `src/config.js`
* Build: `make`
* Set up MongoDB with the following collections:
* `counters: { _id: 'songsid', seq: 0 }`
* `songs`
* `badfiles`

### Usage
* Start: `npm start`
* Scan music directory: `node bin/updatedb.js`
