# nmusic
Node-based music player and organiser, written using React.

### Prerequisites
* Install nodejs

### Prerequisites
* Install node dependencies: `npm install`
* Set backend settings in `code/server/config.js`
* Set up MongoDB with the following collections:
* `counters: { _id: 'songsid', seq: 0 }`
* `songs`
* `users: [{ username: 'myname', password: bcrypt(catdog) }`
* `badfiles`

### Usage
* Start: `npm start`
* Scan music directory: `node bin/updatedb.js`
