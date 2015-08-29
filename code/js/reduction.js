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
      resizeBrowserClicked: -1
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
      selectedSongs: []
    },
    browser: {
      height: 220,
      maxHeight: 400, // TODO: change to be dynamic as the window resizes
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

