# nmusic
Node-based music player and organiser, written using React.

### Prerequisites
* Install nodejs

## Server

### Prerequisites
* Install node dependencies: `npm install`
* Set up MongoDB with the following collections:
* `counters: { _id: 'songsid', seq: 0 }`
* `songs`
* `badfiles`

### Usage
* Set your music directory, port etc. in `config.js`
* `node --harmony updatedb.js` updates the music database
* `node --harmony nmusic_server.js` runs the server
