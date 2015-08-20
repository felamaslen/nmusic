import { itemInRanges } from '../common';

import { List } from 'immutable';

import {
  LIST_SONG_SELECTED,
} from '../constants/Actions';

import buildReducer from './BuildReducer';

const addRange = (top, end, ranges) => {
  let _ranges;

  const neighbourIndexes = List.of(
    ranges.findIndex(range => range.last() === top - 1),
    ranges.findIndex(range => range.first() === end + 1)
  );

  if (neighbourIndexes.some(index => index > -1)) {
    // there is an already-selected item next to the clicked item
    _ranges = ranges.splice(
      neighbourIndexes.get(neighbourIndexes.findIndex(index => index > -1)),
      neighbourIndexes.count(index => index > -1),
      List.of(
        neighbourIndexes.get(0) > -1 ? ranges.get(neighbourIndexes.get(0)).first() : top,
        neighbourIndexes.get(1) > -1 ? ranges.get(neighbourIndexes.get(1)).last() : end
      )
    );
  } else {
    // both items either side of the clicked item remain deselected
    const insertAtIndex = ranges.findIndex(range => range.first() >= end);

    const newRange = List.of(top, end);

    _ranges = insertAtIndex > -1
      ? ranges.splice(insertAtIndex, 0, newRange)
      : ranges.push(newRange);
  }

  return _ranges;
};

export default buildReducer({
  [LIST_SONG_SELECTED]: (reduction, evt) => {
    const ranges = reduction.getIn(['appState', 'songList', 'selectedSongs']);
    const clickedLast = reduction.getIn(['appState', 'songList', 'clickedLast']);

    const clicked = evt.index;

    let newRanges = ranges;

    if (clickedLast === null || (!evt.shift && !evt.ctrl)) {
      // select just the clicked item, deselect all others
      newRanges = List.of(List.of(clicked, clicked));
    } else if (evt.shift) {
      // make sure all between clicked and clickedLast are selected
      const mainTop = Math.min(clicked, clickedLast);
      const mainEnd = Math.max(clicked, clickedLast);

      let subRanges = List.of();

      let subTop = false;
      let subEnd = false;

      for (let i = mainTop; i <= mainEnd; i++) {
        const itemIndex = itemInRanges(ranges, i);
        if (itemIndex === -1 && subTop === false) {
          subTop = i;
        } else if (itemIndex > -1 && subTop !== false) {
          subEnd = i - 1;
          subRanges = subRanges.push(List.of(subTop, subEnd));

          subTop = false;
          subEnd = false;
        }
      }

      if (subEnd === false && subTop !== false) {
        subRanges = subRanges.push(List.of(subTop, mainEnd));
      }

      subRanges.forEach(subRange => {
        newRanges = addRange(subRange.first(), subRange.last(), newRanges);
      });
    } else if (evt.ctrl) {
      const selectedIndex = itemInRanges(ranges, clicked);

      if (selectedIndex > -1) {
        // deselect this item
        const top = ranges.get(selectedIndex).first();
        const end = ranges.get(selectedIndex).last();

        const args = [selectedIndex, 1];

        if (top < clicked) {
          args.push(List.of(top, clicked - 1));
        }
        if (end > clicked) {
          args.push(List.of(clicked + 1, end));
        }

        newRanges = ranges.splice.apply(ranges, args);
      } else {
        // select this item
        newRanges = addRange(clicked, clicked, ranges);
      }
    }

    return reduction
      .setIn(['appState', 'songList', 'clickedLast'], clicked)
      .setIn(['appState', 'songList', 'selectedSongs'], newRanges)
    ;
  }
});
