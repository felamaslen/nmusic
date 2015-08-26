# nmusic
Node-based music player and organiser, written using React.

Version: 0.0.3-dev

### Prerequisites
* Install _nodejs_ if you haven't already
* Get access to a running _MongoDB_ server
* In `code/server/config.js`:
* 1. Set `MONGO_URL` to your particular database instance.
* 2. Set `MUSIC_DIR` to the directory containing your music files.
* 3. Set `SERVER_PORT` to the port on which you wish to run the server.
* 4. Set `GET_ALL_SONGS` to `false` if you have more than a couple of hundred songs.
* Create a clean database: `npm run dropdb`
* **Most important:** Install the app: `npm install`

#### Tasks
* Clear the database: `npm run dropdb`
* Scan for music files: `npm run updatedb`

I suggest running the second one regularly.

### Usage
* Start: `npm start`
* Access the web interface (the default port is 8080)
* The default username and password are **user** and **password** respectively

#### Notes
This is a preview, development release. _Expect_ bugs to exist. _Expect_ lack of key features. _Expect_ to have to debug things.

If you do find a bug, don't be afraid to file an issue on Github! It would be much appreciated.
