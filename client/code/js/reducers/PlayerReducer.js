export const addToQueue = (reduction, options) => {
  const playAfter = !!options.playAfter;

  return reduction
    .setIn(
      ['appState', 'player', 'currentSongId'],
      playAfter
        ? reduction.getIn(['appState', 'player', 'queue']).size
        : reduction.getIn(['appState', 'player', 'currentSongId'])
    )
    .setIn(
      ['appState', 'player', 'queue'],
      reduction.getIn(['appState', 'player', 'queue']).concat(options.songs)
    )
    .setIn(
      ['appState', 'player', 'paused'],
      typeof options.playAfter !== 'undefined'
        ? !playAfter
        : reduction.getIn(['appState', 'player', 'paused'])
    )
  ;
};

export const playQueueItem = (reduction, queueId) => {
  return reduction
    .setIn(['appState', 'player', 'paused'], false)
    .setIn(
      ['appState', 'player', 'currentSong'],
      reduction.getIn(['appState', 'player', 'queue']).get(queueId)
    )
  ;
};

export const togglePause = (reduction, paused) => {
  const _paused = reduction.getIn(['appState', 'player', 'currentSongId']) > -1
    ? paused : reduction.getIn(['appState', 'player', 'paused']);

  return reduction
    .setIn(['appState', 'player', 'paused'], _paused);
};

export const ctrlPrevious = reduction => {
  const currentSongId = reduction.getIn(['appState', 'player', 'currentSongId']);
  const queue = reduction.getIn(['appState', 'player', 'queue']);

  let newCurrentSongId = currentSongId - 1;
  let newQueue;

  if (newCurrentSongId > -1) {
    // play previous song in queue
    newQueue = queue;
  } else {
    // play previous song in songlist, if it exists, since
    // we are already at the bottom of the queue
    const currentId = queue.getIn([currentSongId, 'id']);
    const songList = reduction.getIn(['appState', 'songList', 'list']);
    const songId = songList.findIndex(
      song => song.get('id') === currentId
    );

    if (songId > 0) {
      newCurrentSongId = 0;
      newQueue = queue.unshift(songList.get(songId - 1));
    } else {
      // nothing to play; clear the queue
      newCurrentSongId = -1;
      newQueue = List.of();
    }
  }

  return reduction
    .setIn(['appState', 'player', 'currentSongId'], newCurrentSongId)
    .setIn(['appState', 'player', 'queue'], newQueue)
  ;
};

export const ctrlNext = reduction => {
  const currentSongId = reduction.getIn(['appState', 'player', 'currentSongId']);
  const queue = reduction.getIn(['appState', 'player', 'queue']);

  let newCurrentSongId = currentSongId + 1;
  let newQueue;

  if (currentSongId < queue.size - 1) {
    // play next song in queue
    newQueue = queue;
  } else {
    // play next song in songlist, if it exists, since
    // we are already at the end of the queue
    const currentId = queue.getIn([currentSongId, 'id']);
    const songList = reduction.getIn(['appState', 'songList', 'list']);
    const songId = songList.findIndex(
      song => song.get('id') === currentId
    );

    if (songId > -1 && songId < songList.size - 1) {
      newCurrentSongId = queue.size;
      newQueue = queue.push(songList.get(songId + 1));
    } else {
      // nothing to play; clear the queue
      newCurrentSongId = -1;
      newQueue = List.of();
    }
  }

  return reduction
    .setIn(['appState', 'player', 'currentSongId'], newCurrentSongId)
    .setIn(['appState', 'player', 'queue'], newQueue)
  ;
};

export const ctrlSeek = (reduction, position) => {
  return reduction
    .setIn(['appState', 'player', 'setTime'], parseFloat(position, 10))
  ;
};
