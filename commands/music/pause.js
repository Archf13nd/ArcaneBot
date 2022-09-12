const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const isUserInVoice = require('./guards/userInVoice');
const InteractionError = require('../../util/interactionError');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pauses the current playing song'),
  async execute(interaction) {
    // Throws error if false
    await isUserInVoice(interaction);

    const connection = await getVoiceConnection(interaction.member.guild.id);

    console.log(connection.player.state.status);

    if (connection.player.state.status !== 'playing') {
      const publicErrorMessage = 'There is no song playing though';
      throw new InteractionError('User trying to pause when song is already paused', publicErrorMessage);
    }

    await connection.player.pause();
    await interaction.reply('Song has been paused, /resume to continue listening');
  },
};
