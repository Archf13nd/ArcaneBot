const handleCurrentPlaylist = (currentPlaylist) => {
  if (currentPlaylist.name) {
    return `**CURRENT PLAYLIST**\n${currentPlaylist.name}\n<${currentPlaylist.url}>\n`;
  }
  return '';
};

const handleComingUp = (comingUp) => {
  if (comingUp) {
    return `**COMING UP**\n${comingUp}`;
  }
  return '';
};

const buildSongString = (title, duration, reqBy = 'Anon') => {
  const string = `${title} -- duration: ${duration} -- requested by: ${reqBy}\n`;
  return string;
};

const display = (nowPlaying, currentPlaylist, comingUp) => `**NOW PLAYING**
${nowPlaying}
${handleCurrentPlaylist(currentPlaylist)}
${handleComingUp(comingUp)}`;

module.exports = (currentSong, currentPlaylist, comingUpArray) => {
  const nowPlaying = buildSongString(
    currentSong.youtubeData.title,
    currentSong.youtubeData.durationRaw,
    currentSong.reqBy,
  );
  let comingUpString = '';

  for (let i = 0; i < comingUpArray.length; i += 1) {
    const song = comingUpArray[i];
    // console.log('main-display', song)
    comingUpString += buildSongString(
      song.youtubeData.title,
      song.youtubeData.durationRaw,
      song.reqBy,
    );
  }

  return display(nowPlaying, currentPlaylist, comingUpString);
};
