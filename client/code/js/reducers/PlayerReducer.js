import { PREVIOUS_SONG_DELAY } from '../config';

export const addToQueue = (reduction, options) => {
  const playAfter = !!options.playAfter;

  const queue = reduction.getIn(['appState', 'player', 'queue']);
  const queueId = reduction.getIn(['appState', 'player', 'queueId']);

  return reduction
    .setIn(['appState', 'player', 'queue'], queue.concat(options.songs))
    .setIn(['appState', 'player', 'queueId'], playAfter ? queue.size : queueId)
    .setIn(['appState', 'player', 'currentSong'], playAfter
      ? options.songs.first()
      : reduction.getIn(['appState', 'player', 'currentSong'])
    )
    .setIn(['appState', 'player', 'paused'], typeof options.playAfter !== 'undefined'
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

export const playListItem = (reduction, song) => {
  return reduction
    .setIn(['appState', 'player', 'currentSong'], song)
    .setIn(['appState', 'player', 'queueId'], -1)
    .setIn(['appState', 'player', 'paused'], false)
  ;
};

export const togglePause = (reduction, paused) => {
  const _paused = reduction.getIn(['appState', 'player', 'currentSong']) !== null
    ? paused : reduction.getIn(['appState', 'player', 'paused']);

  return reduction
    .setIn(['appState', 'player', 'paused'], _paused);
};

export const ctrlPrevious = reduction => {
  const currentSong = reduction.getIn(['appState', 'player', 'currentSong']);
  const queue = reduction.getIn(['appState', 'player', 'queue']);
  const queueId = reduction.getIn(['appState', 'player', 'queueId']);

  let newReduction;

  const changeSong = reduction.getIn(['appState', 'player', 'currentTime']) < PREVIOUS_SONG_DELAY;

  if (changeSong) {
    // skip to previous track
    let newSong;

    const newQueueId = Math.max(-1, queueId - 1);

    if (queueId > 0) {
      // play previous song in queue
      newSong = queue.get(newQueueId);
    } else {
      // play previous song in songlist, if it exists, since
      // we are already at the bottom of the queue
      const currentSongId = currentSong.get('id');
      const songList = reduction.getIn(['appState', 'songList', 'list']);
      const listId = songList.findIndex(
        song => song.get('id') === currentSongId
      );

      newSong = listId > 0 ? songList.get(listId - 1) : null;
    }

    newReduction = reduction
      .setIn(['appState', 'player', 'currentSong'], newSong)
      .setIn(['appState', 'player', 'queueId'], newQueueId)
    ;
  } else {
    // go back to the beginning of the track
    newReduction = reduction
      .setIn(['appState', 'player', 'setTime'], 0)
    ;
  }

  return newReduction;
};

export const ctrlNext = reduction => {
  const currentSong = reduction.getIn(['appState', 'player', 'currentSong']);
  const queue = reduction.getIn(['appState', 'player', 'queue']);
  const queueId = reduction.getIn(['appState', 'player', 'queueId']);

  let newSong;

  const newQueueId = queueId < queue.size - 1 ? queueId + 1 : -1;

  if (queueId < queue.size - 1) {
    // play next song in queue
    newSong = queue.get(queueId + 1);
  } else {
    // play next song in songlist, if it exists, since
    // we are already at the end of the queue
    const currentSongId = currentSong.get('id');
    const songList = reduction.getIn(['appState', 'songList', 'list']);
    const listId = songList.findIndex(
      song => song.get('id') === currentSongId
    );

    newSong = listId > -1 && listId < songList.size - 1
      ? songList.get(listId + 1) : null;
  }

  return reduction
    .setIn(['appState', 'player', 'currentSong'], newSong)
    .setIn(['appState', 'player', 'queueId'], newQueueId)
  ;
};

export const ctrlSeek = (reduction, position) => {
  return reduction
    .setIn(['appState', 'player', 'setTime'], parseFloat(position, 10))
  ;
};
