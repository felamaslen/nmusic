import { Record, fromJS, List } from 'immutable';

export default new Record({
  appState: fromJS({
    auth: {
      status: 2,  // 0: logged in, 1: bad login, 2: waiting for user, 3: loading, 4: server error
      username: null,
      token: ''
    },
    loaded: {
      browserArtists: false,
      songList: false
    },
    loadedOnLastRender: false,
    warnBeforeNavigation: false,
    eventHandlers: {},
    customSlider: {
      volumeClicked: -1,
      seekbarClicked: -1
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

