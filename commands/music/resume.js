const { SlashCommandBuilder } = require('discord.js');
const resume = require('./actions/resume');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resumes playing of paused song'),
  async execute(interaction) {
    await resume(interaction);
  },

};
