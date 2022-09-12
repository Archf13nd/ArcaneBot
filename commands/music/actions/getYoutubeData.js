const playDL = require('play-dl');
// const interactionError = require('../../../util/interactionError');

module.exports = async (songName) => {
  const videos = await playDL.search(`${songName} music`, { source: { youtube: 'video' } });
  const songData = videos[0];

  // const isURLValid = playDL.yt_validate(songURL)
  // if (!isURLValid) {
  //     throw new Error('Invalid url')
  // }

  return songData;
};
