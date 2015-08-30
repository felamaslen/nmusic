import {
  getRangesAfterClick,
  _sortSongList
} from '../common';

import { List } from 'immutable';

import { SETTINGS_UPDATE_TRIGGERED } from '../constants/effects';

import buildMessage from '../MessageBuilder';

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

export const sortSongList = (reduction, column) => {
  const orderBy = reduction.getIn(['appState', 'songList', 'orderBy']);

  const existingKey = orderBy.findIndex(item => item.first() === column);

  const oldOrder = orderBy.get(existingKey).last();
  const newOrder = (oldOrder + 2) % 3 - 1;

  const newOrderBy = orderBy.delete(existingKey).push(List.of(column, newOrder));

  return reduction
    .setIn(['appState', 'songList', 'orderBy'], newOrderBy)
    .setIn(
      ['appState', 'songList', 'list'],
      _sortSongList(reduction.getIn(['appState', 'songList', 'list']), newOrderBy)
    )
    .setIn(['appState', 'songList', 'selectedSongs'], List.of())
    .set('effects', reduction.get('effects').push(buildMessage(SETTINGS_UPDATE_TRIGGERED)));
};
