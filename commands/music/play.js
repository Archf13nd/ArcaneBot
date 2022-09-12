const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

const joinVoiceChannel = require('./actions/join-voice');
const isUserInVoice = require('./guards/userInVoice');
const resume = require('./actions/resume');
const InteractionError = require('../../util/interactionError');
const processPlayInput = require('./actions/processPlayInput');
const queueHandler = require('./actions/queueHandler');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays music!')
    .addStringOption((option) => option.setName('input')
      .setDescription('Takes song name or youtube url')),
  async execute(interaction) {
    // PLAY SPECIFIC
    // Check user is in voice
    // Check if player needs resuming
    // Establish connection & subcribe player
    // Set active channel
    // Handle new input with processPlayInput
    // Push new array to queue
    // Create message display and store id in connection
    // Run global song handler

    await interaction.deferReply();

    // Throws error if false
    await isUserInVoice(interaction);

    const inputString = interaction.options.getString('input');
    if (!inputString) {
      await resume(interaction);
      return;
    }

    const requestedBy = await interaction.member.displayName;

    await interaction.editReply('Handling request. . .');

    // Establist connection
    let connection = getVoiceConnection(interaction.member.guild.id);
    if (!connection) {
      connection = await joinVoiceChannel(interaction);
      connection.player.queue = [];
      connection.player.currentPlaylist = {
        name: null,
        url: null,
      };
      await connection.subscribe(connection.player);
      console.log('connection established');
    }

    connection.activeChannel = interaction.channel;

    // Set message display
    if (!connection.display) {
      connection.display = await interaction.fetchReply();
    } else {
      await interaction.deleteReply();
    }

    // Expecting array with youtube urls or keyword searches
    const playlistData = await processPlayInput(inputString);
    const arrayOfQueries = playlistData.queries;
    const { playlistName } = playlistData;
    const { playlistURL } = playlistData;

    if (!playlistData.queries) {
      throw new InteractionError('Bad input', 'There was something wrong with your input');
    }

    console.log('requested by', requestedBy);
    connection.player.queue.unshift({
      arrayOfQueries,
      playlistName,
      playlistURL,
      reqBy: requestedBy,
    });

    queueHandler(connection);
  },
};
