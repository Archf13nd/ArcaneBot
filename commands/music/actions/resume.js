const { getVoiceConnection } = require('@discordjs/voice');
const isUserInVoice = require('../guards/userInVoice');
const InteractionError = require('../../../util/interactionError');

module.exports = async (interaction) => {
  // Throws error if user is not in voice
  await isUserInVoice(interaction);

  const connection = await getVoiceConnection(interaction.member.guild.id);

  if (!connection) {
    const publicErrorMessage = 'There is nothing to play';
    throw new InteractionError('Song is already playing', publicErrorMessage);
  }

  if (connection.player.state.status !== 'paused') {
    let publicErrorMessage;
    if (connection.player.state.status === 'idle') {
      publicErrorMessage = 'There is nothing to play :(';
    } else {
      publicErrorMessage = 'The song is already playing, what exactly are you trying to do?';
    }
    throw new InteractionError('Song is already playing', publicErrorMessage);
  }

  await connection.player.unpause();
  await interaction.reply('Song has been resumed');
};
