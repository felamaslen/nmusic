// common client functions

import { List } from 'immutable';
import { PropTypes } from 'react';

import {
  NAVIGATION_WARNING_MESSAGE,
  DOCUMENT_TITLE,
  TIME_DISPLAY_NOTIFICATIONS
} from './config';

export const debounce = (func, wait, immediate) => {
  let timeout;
  return () => {
    const args = arguments;
    const later = () => {
      timeout = null;
      if (!immediate) {
        func.apply(this, args);
      }
    };

    const callNow = immediate && !timeout;
    window.clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(this, args);
    }
  };
};

export const getOffset = element => element.getBoundingClientRect();

export const sliderProps = {
  vertical: PropTypes.bool,
  drag: PropTypes.bool,
  clicked: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.number,
  name: PropTypes.string,
  colors: PropTypes.func,
  changedAction: PropTypes.func,
  clickedAction: PropTypes.func,
  eventHandlers: PropTypes.instanceOf(List)
};

export function sliderMouseDown(ref, ev) {
  ev.stopPropagation();
  if (this.props.drag) {
    const _offset = getOffset(this.refs[ref].getDOMNode());

    // "vertical" means "movement in the vertical direction"
    const offset = this.props.vertical ? _offset.top : _offset.left;

    this.dispatchAction(this.props.clickedAction({
      name: this.props.name,
      clickPosition: (this.props.vertical ? ev.clientY : ev.clientX) - offset
    }));
  }
}

export function sliderOnShouldComponentUpdate(nextProps) {
  if (nextProps.clicked > -1 && this.props.clicked < 0) {
    window.addEventListener('mouseup', this.props.eventHandlers.get(0), false);
    window.addEventListener('mousemove', this.props.eventHandlers.get(1), false);
  } else if (nextProps.clicked < 0 && this.props.clicked > -1) {
    window.removeEventListener('mouseup', this.props.eventHandlers.get(0), false);
    window.removeEventListener('mousemove', this.props.eventHandlers.get(1), false);
  }

  return true;
}

export const getDocumentTitle = (canNotify, song, paused) => {
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

  newTitle = newTitle + DOCUMENT_TITLE;

  if (canNotify) {
    const artistText = haveArtist ? ' - ' + song.get('artist') : '';

    const title = 'nmusic' + (haveTitle ? ': ' + song.get('title') + artistText : '');

    const body = paused || !song ? 'Paused' : 'Playing';

    const icon = 'img/app.png';

    const notification = new Notification(title, {
      body: body,
      icon: icon
    });

    window.setTimeout(() => notification.close(), 1000 * TIME_DISPLAY_NOTIFICATIONS);
  }

  return newTitle;
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

export const secondsToTime = secondsFloat => {
  const secondsInt = Math.round(secondsFloat);

  const days = Math.floor(secondsInt / 86400);
  const hours = Math.floor((secondsInt % 86400) / 3600);
  const minutes = Math.floor((secondsInt % 3600) / 60).toString();
  const seconds = (secondsInt % 60).toString();

  if (isNaN(days) || isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
    return '00:00';
  }

  const _dd = days >= 10 ? days.toString() : `0${days}`;
  const dd = days > 0 ? `${_dd}:` : '';

  const _hh = hours >= 10 ? hours.toString() : `0${hours}`;
  const hh = days > 0 || hours > 0 ? `${_hh}:` : '';

  const mm = !!minutes[1] ? minutes : `0${minutes}`;
  const ss = !!seconds[1] ? seconds : `0${seconds}`;

  return `${dd}${hh}${mm}:${ss}`;
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
    year: song[6]
  };
};
