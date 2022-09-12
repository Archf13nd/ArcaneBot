const { VoiceConnectionStatus } = require('@discordjs/voice');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = (interaction) => {
  const guild = interaction.member.guild.id;
  const connection = getVoiceConnection(guild);

  console.log(connection.getMaxListeners());

  // const startTimeout = (timeBeforeDestroy) => {
  //     const timeout = setTimeout(() => {
  //         const connection = getVoiceConnection(interaction.member.guild.id)
  //         connection.player.stop()
  //         connection.destroy()
  //     }, timeBeforeDestroy)
  //     return timeout
  // }

  connection.on(VoiceConnectionStatus.Ready, () => {
    console.log('Music Bot is ready');
    // if (timeoutId) {
    //     console.log('Bot saved from destruction')
    //     clearTimeout(timeoutId)
    // }
  });

  connection.on(VoiceConnectionStatus.Disconnected, () => {
    console.log('Bot disconnected from voice');
    connection.player.stop();
  });

  connection.on(VoiceConnectionStatus.Destroyed, () => {
    console.log('Music Bot has died');
  });
};
