const { joinVoiceChannel } = require('@discordjs/voice');
const { getVoiceConnection } = require('@discordjs/voice');
const { createAudioPlayer, NoSubscriberBehavior } = require('@discordjs/voice');

const registerVoiceConnectionEvents = require('../events/voiceConnectionEvents');
const registerAudioPlayerEvents = require('../events/audioPlayerEvents');

module.exports = (interaction) => {
  let connection = getVoiceConnection(interaction.member.guild.id);

  if (!connection) {
    connection = joinVoiceChannel({
      channelId: interaction.member.voice.channelId,
      guildId: interaction.member.guild.id,
      adapterCreator: interaction.member.guild.voiceAdapterCreator,
      selfDeaf: false,
    });
    registerVoiceConnectionEvents(interaction);
  } else {
    connection.rejoin();
  }
  connection.player = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Play,
    },
  });
  registerAudioPlayerEvents(interaction);
  return connection;
};
