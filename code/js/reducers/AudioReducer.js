import { } from 'immutable';

export const audioCanPlay = reduction => {
  // Sent when enough data is available that the media can be played, at least
  // for a couple of frames.  This corresponds to the HAVE_ENOUGH_DATA readyState.
  return reduction;
};

export const audioLoadStart = reduction => {
  // Sent when loading of the media begins.
  return reduction;
};

export const audioDurationChange = (reduction, time) => {
  // The metadata has loaded or changed, indicating a change in duration of the media.
  // This is sent, for example, when the media has loaded enough that the duration is known.
  return reduction
    .setIn(['appState', 'player', 'currentSong', 'time'], time)
  ;
};

export const audioError = reduction => {
  // Sent when an error occurs. The element's error attribute contains more information.
  return reduction;
};

export const audioProgress = reduction => {
  // Sent periodically to inform interested parties of progress downloading the media.
  // Information about the current amount of the media that has been downloaded is
  // available in the media element's buffered attribute.
  return reduction;
};

export const audioTimeUpdate = (reduction, position) => {
  // The time indicated by the element's currentTime attribute has changed.
  return reduction
    .setIn(['appState', 'player', 'currentTime'], position)
  ;
};

export const audioVolumeChange = (reduction, _volume) => {
  // Sent when the audio volume changes (both when the volume is set
  // and when the muted attribute is changed).
  const relative = _volume.toString().match(/^(\-|\+)/);

  let factor;
  if (relative) {
    factor = _volume.substring(0, 1) === '+' ? 1 : -1;
  }

  const volume = relative
    ? reduction.getIn(['appState', 'player', 'volume'])
      + factor * parseFloat(_volume.substring(1), 10)
    : parseFloat(_volume, 10);

  return reduction
    .setIn(['appState', 'player', 'volume'], Math.max(0, Math.min(1, volume)))
  ;
};
