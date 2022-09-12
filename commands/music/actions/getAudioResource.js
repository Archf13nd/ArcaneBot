const playDL = require('play-dl');
const { createAudioResource } = require('@discordjs/voice');
// const interactionError = require('../../../util/interactionError');

module.exports = async (youtubeURL) => {
  const stream = await playDL.stream(youtubeURL);
  const audioResource = createAudioResource(stream.stream, {
    inputType: stream.type,
  });
  return audioResource;
};
