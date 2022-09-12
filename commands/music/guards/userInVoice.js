const InteractionError = require('../../../util/interactionError');

module.exports = async (interaction) => {
  if (!interaction.member.voice.channelId) {
    const publicErrorMessage = 'Please be in a voice channel before using this command';
    throw new InteractionError('User not in voice', publicErrorMessage);
  }
};
