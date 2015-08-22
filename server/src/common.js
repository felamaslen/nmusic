// common functions

export const formatTime = () => {
  const date = new Date();

  const yyyy = date.getFullYear().toString();
  const mm_ = (date.getMonth() + 1).toString(); // getMonth() is zero-based
  const dd = date.getDate().toString();

  const HH = date.getHours().toString();
  const MM = date.getMinutes().toString();
  const SS = date.getSeconds().toString();

  return yyyy + '-' + (!!mm_[1] ? mm_ : '0' + mm_[0]) + '-'
    + (!!dd[1] ? dd : '0' + dd[0]) + ' '
    + HH + ':' + MM + ':' + SS;
};

export const secureParam = param => decodeURIComponent(param.toString());

export const compressSongs = songs => {
  // use arrays to save bandwidth on keys
  return songs.map(song => [
    song._id,
    song.track,
    song.title,
    song.artist,
    song.album,
    song.genre,
    song.time,
    song.year
  ]);
};

