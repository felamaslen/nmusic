import { Record, fromJS, List } from 'immutable';

export default new Record({
  appState: fromJS({
    loaded: {
      browserArtists: false,
      songList: false
    },
    loadedOnLastRender: false,
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

