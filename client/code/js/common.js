// common client functions

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

export const itemInRanges = (ranges, index) =>
  ranges.findIndex(range =>
    range.first() <= index && range.last() >= index
  );

export const decompressSongs = song => {
  return {
    id: song[0],
    track: song[1],
    title: song[2],
    artist: song[3],
    album: song[4],
    genre: song[5],
    time: song[6],
    year: song[7],
  };
};
