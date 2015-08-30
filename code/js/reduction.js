import { Record, fromJS, List } from 'immutable';

import {
  DOCUMENT_TITLE,
  AUTH_STATUS_WAITING
} from './config';

export default new Record({
  appState: fromJS({
    auth: {
      status: AUTH_STATUS_WAITING,
      username: null,
      token: ''
    },
    loaded: {
      authStatus: false,
      browserArtists: false,
      songList: false,
      settingsCookie: false
    },
    loadedOnLastRender: false,
    userMenuActive: false,
    canNotify: false,
    title: DOCUMENT_TITLE, // window title
    warnBeforeNavigation: false,
    eventHandlers: {},
    slider: {
      volumeClicked: -1,
      seekbarClicked: -1,
      resizeBrowserClicked: -1,
      titleClicked: -1,
      artistClicked: -1,
      albumClicked: -1,
      genreClicked: -1
    },
    player: {
      queue: [],
      queueId: -1,
      currentSong: null,
      buffered: null,
      paused: true,
      volume: 0.7,
      currentTime: 0,
      setTime: -1
    },
    songList: {
      list: [],
      clickedLast: null,
      selectedSongs: [],
      // for ordering the columns
      // 1 is ascending, -1 is descending
      orderBy: [
        ['artist', 0],
        ['album', 0],
        ['track', 0],
        ['title', 0],
        ['genre', 0]
      ],
      // for resizing the columns
      colWidthPreview: {
        title: 220,
        artist: 180,
        album: 180,
        genre: 120
      },
      // for saving the resized state
      colWidthActual: {
        title: 220,
        artist: 180,
        album: 180,
        genre: 120
      }
    },
    browser: {
      height: 220,
      maxHeight: 400, // this is dynamic
      selectedArtists: [],
      selectedAlbums: [],
      artistClickedLast: null,
      albumClickedLast: null,
      listArtists: List.of(),
      listAlbums: List.of()
    }
  }),
  effects: List.of()
});

