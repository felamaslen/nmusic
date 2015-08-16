import { itemInRanges } from '../common';

import { fromJS } from 'immutable';

import {
  LIST_SONG_SELECTED,
} from '../constants/Actions';

import buildReducer from './BuildReducer';

export default buildReducer({
  [LIST_SONG_SELECTED]: (reduction, evt) => {
    let newRanges;

    if (evt.ctrl) {
      const ranges = reduction.getIn(['appState', 'songList', 'selectedSongs']);

      const inRange = itemInRanges(ranges, evt.index);

      if (inRange > -1) {
        // deselect item
        const splitRange = ranges.get(inRange);
        const splitLeft = splitRange.first();
        const splitRight = splitRange.last();

        newRanges = ranges.splice(
          inRange,
          1,
          fromJS([splitLeft, evt.index - 1]),
          fromJS([evt.index + 1, splitRight])
        );
      } else {
        // select item
        newRanges = ranges.push(fromJS([evt.index, evt.index]));
      }
    } else if (evt.shift) {
      console.debug('shift not implemented');
      newRanges = ranges;
    } else {
      newRanges = fromJS([[evt.index, evt.index]]);
    }

    return reduction
      .setIn(['appState', 'songList', 'selectedSongs'], newRanges)
    ;
  },
});
