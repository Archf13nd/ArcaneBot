const { getVoiceConnection } = require('@discordjs/voice');
const { AudioPlayerStatus } = require('@discordjs/voice');
const queueHandler = require('../actions/queueHandler');

module.exports = (interaction) => {
  const connection = getVoiceConnection(interaction.member.guild.id);

  connection.player.on(AudioPlayerStatus.Playing, () => {

  });

  connection.player.on(AudioPlayerStatus.Idle, async () => {
    console.log('Player is now idle');

    const songsInQueue = await queueHandler(connection);

    if (!songsInQueue) {
      connection.destroy();
    }
  });
  connection.player.on(AudioPlayerStatus.Paused, () => {
    console.log('The audio player is paused');
  });
};
