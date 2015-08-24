// common client functions

import { List } from 'immutable';

import {
  NAVIGATION_WARNING_MESSAGE,
  DOCUMENT_TITLE
} from './config';

export const getDocumentTitle = (song, paused) => {
  const haveTitle = !!song && !!song.get('title');
  const haveArtist = haveTitle && !!song.get('artist');

  let newTitle = '';

  if (haveTitle) {
    if (paused) {
      newTitle += '[Paused] ';
    }

    newTitle += song.get('title');
    if (haveArtist) {
      newTitle += ' - ' + song.get('artist');
    }
    newTitle += ' - ';
  }

  return newTitle + DOCUMENT_TITLE;
};

export const _warnBeforeNavigation = warn => {
  if (warn) {
    window.onbeforeunload = _ev => {
      const ev = !_ev ? window.event : _ev;

      if (!!ev) {
        ev.returnValue = NAVIGATION_WARNING_MESSAGE;
      }

      return NAVIGATION_WARNING_MESSAGE;
    };
  } else {
    window.onbeforeunload = null;
  }

  return true;
};

export const trackFormat = track => track < 10 ? '0' + track.toString() : track.toString();

export const secondsToTime = _seconds => {
  const days = Math.floor(_seconds / 86400);
  const hours = Math.floor((_seconds % 86400) / 3600);
  const minutes = Math.floor((_seconds % 3600) / 60).toString();
  const seconds = Math.round(_seconds % 60).toString();

  const dd = days > 0
    ? (!!days.toString()[1] ? days.toString() : '0' + days.toString()) + ':'
    : '';

  const hh = days > 0 || hours > 0
    ? (!!hours.toString()[1] ? hours.toString() : '0' + hours.toString()) + ':'
    : '';

  const mm = !!minutes[1] ? minutes : '0' + minutes;
  const ss = !!seconds[1] ? seconds : '0' + seconds;

  return dd + hh + mm + ':' + ss;
};

export const createRanges = list => {
  let _ranges = List.of();

  const _list = list.sort();

  let top = false;
  let lastKey = _list.first();

  _list.forEach(key => {
    if (top === false ) {
      top = lastKey;
    }

    if (key > lastKey + 1) {
      _ranges = _ranges.push(List.of(top, lastKey));
      top = false;
    }

    lastKey = key;
  });

  _ranges = _ranges.push(List.of(top, _list.last()));

  return _ranges;
};

const _itemInRanges = (ranges, index) =>
  ranges.findIndex(range =>
    range.first() <= index && range.last() >= index
  );

export const itemInRanges = _itemInRanges;

const _addRange = (top, end, ranges) => {
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

export const getRangesAfterClick = (ranges, shift, ctrl, clickedLast, clicked) => {
  let newRanges = ranges;

  if (clickedLast === null || (!shift && !ctrl)) {
    // select just the clicked item, deselect all others
    newRanges = List.of(List.of(clicked, clicked));
  } else if (shift) {
    // make sure all between clicked and clickedLast are selected
    const mainTop = Math.min(clicked, clickedLast);
    const mainEnd = Math.max(clicked, clickedLast);

    let subRanges = List.of();

    let subTop = false;
    let subEnd = false;

    for (let i = mainTop; i <= mainEnd; i++) {
      const itemIndex = _itemInRanges(ranges, i);
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
      newRanges = _addRange(subRange.first(), subRange.last(), newRanges);
    });
  } else if (ctrl) {
    const selectedIndex = _itemInRanges(ranges, clicked);

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
      newRanges = _addRange(clicked, clicked, ranges);
    }
  }

  return newRanges;
};

export const decompressSongs = song => {
  return {
    id: song[0],
    track: song[1],
    title: song[2],
    artist: song[3],
    album: song[4],
    genre: song[5],
    time: song[6],
    year: song[7]
  };
};
