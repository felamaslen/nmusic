import { fromJS } from 'immutable';

export const addToQueue = (reduction, track) => {
  return reduction
    .setIn(
      ['appState', 'player', 'trackHistory'],
      reduction.getIn(['appState', 'player', 'trackHistory']).push(fromJS(track))
    )
  ;
};

export const playQueueItem = (reduction, queueId) => {
  return reduction
    .setIn(['appState', 'player', 'paused'], false)
    .setIn(
      ['appState', 'player', 'currentTrack'],
      reduction.getIn(['appState', 'player', 'trackHistory']).get(queueId)
    )
  ;
};

export const togglePause = (reduction, paused) => {
  return reduction
    .setIn(['appState', 'player', 'paused'], paused);
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
