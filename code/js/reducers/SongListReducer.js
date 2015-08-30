import { getRangesAfterClick } from '../common';

import { } from 'immutable';

export const selectSong = (reduction, evt) => {
  const newRanges = getRangesAfterClick(
    reduction.getIn(['appState', 'songList', 'selectedSongs']),
    evt.shift,
    evt.ctrl,
    reduction.getIn(['appState', 'songList', 'clickedLast']),
    evt.index
  );

  return reduction
    .setIn(['appState', 'songList', 'clickedLast'], evt.index)
    .setIn(['appState', 'songList', 'selectedSongs'], newRanges)
  ;
};

export const columnResized = (reduction, options) => {
  // this gets called on every mousemove event while resizing a column
  const col = options.name;
  const width = options.dim;

  return reduction
    .setIn(['appState', 'songList', 'colWidthPreview', col], width)
  ;
};

