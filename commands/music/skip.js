const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const InteractionError = require('../../util/interactionError');
const isUserInVoice = require('./guards/userInVoice');

const skipSong = async (player) => {
  player.stop();
};
const skipPlaylist = async (player, queue) => {
  console.log(queue)
  queue.pop();
  player.stop();
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skips music')
    .addStringOption((option) => option.setName('options')
      .setDescription('Choose to skip the current song or the current playlist')
      .setRequired(true)
      .addChoices(
        { name: 'song', value: 'theSong' },
        { name: 'playlist', value: 'thePlaylist' },

      )),
  async execute(interaction) {
    // Throws error if false
    await isUserInVoice(interaction);

    const connection = await getVoiceConnection(interaction.member.guild.id);
    if (!connection) {
      throw new InteractionError('No connection', 'You cannot skip what isn\'t there');
    }

    const option = await interaction.options.getString('options');
    const {queue} = connection.player;

    if (option === 'theSong') {
      if (queue[queue.length - 1].arrayOfQueries[0]) {
        await skipSong(connection.player);
      } else {
        await skipPlaylist(connection.player, queue);
      }
    }
    if (option === 'thePlaylist') {
      if (queue[0]) {
        skipPlaylist(connection.player, queue);
      } else {
        throw new InteractionError('No songs to skip', 'You cannot skip what isn\'t there');
      }
    }
    // console.log('current playlist', connection.player.currentPlaylist)
    // console.log('queue', connection.player.queue)
    await interaction.reply('Song skipped');
    setTimeout(async () => {
      await interaction.deleteReply();
    }, 2000);
  },

};
