import { itemInRanges } from '../common';

import { fromJS } from 'immutable';

import {
  LIST_SONG_SELECTED,
} from '../constants/Actions';

import buildReducer from './BuildReducer';

export default buildReducer({
  [LIST_SONG_SELECTED]: (reduction, evt) => {
    let newRanges;

    const ranges = reduction.getIn(['appState', 'songList', 'selectedSongs']);
    const inRange = itemInRanges(ranges, evt.index);

    if (evt.ctrl) {
      if (inRange > -1) {
        // deselect item
        const splitRange = ranges.get(inRange);
        const splitLeft = splitRange.first();
        const splitRight = splitRange.last();

        const args = [inRange, 1];

        if (splitLeft < evt.index) {
          args.push(fromJS([splitLeft, evt.index - 1]));
        }

        if (splitRight > evt.index) {
          args.push(fromJS([evt.index + 1, splitRight]));
        }

        newRanges = ranges.splice.apply(ranges, args);
      } else {
        // select item
        newRanges = ranges.push(fromJS([evt.index, evt.index]));
      }
    } else if (evt.shift) {
      if (inRange > -1) {
        newRanges = ranges;
      } else {
        // find end of last range
        let lastRange = null;

        ranges.forEach((range, index) => {
          const rangeStart = range.first();
          if (rangeStart < evt.index && (lastRange === null || rangeStart > lastRange[1])) {
            lastRange = [index, rangeStart];
          }
        });

        if (lastRange !== null) {
          const newLastRange = fromJS([lastRange[1], evt.index]);

          newRanges = ranges.splice(lastRange[0], 1, newLastRange);
        } else {
          newRanges = ranges;
        }
      }
    } else {
      newRanges = fromJS([[evt.index, evt.index]]);
    }

    return reduction
      .setIn(['appState', 'songList', 'selectedSongs'], newRanges)
    ;
  },
});
