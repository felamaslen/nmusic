import { Record, fromJS, List } from 'immutable';

export default new Record({
  appState: fromJS({
    loaded: {
      firstList: false,
      browserArtists: false,
      browserAlbums: false,
      songList: true
    },
    loadedOnLastRender: false,
    player: {
      queue: [],
      currentSongId: -1,
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
      selectedArtist: -1,
      selectedAlbum: -1,
      listArtists: List.of(),
      listAlbums: List.of()
    }
  }),
  effects: List.of()
});

