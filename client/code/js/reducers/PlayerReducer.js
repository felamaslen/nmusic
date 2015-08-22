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
  console.debug('PLAYER_CTRL_PREVIOUS_CLICKED');
  return reduction;
};

export const ctrlNext = reduction => {
  console.debug('PLAYER_CTRL_NEXT_CLICKED');
  return reduction;
};

export const ctrlSeek = (reduction, position) => {
  return reduction
    .setIn(['appState', 'player', 'setTime'], parseFloat(position, 10))
  ;
};
