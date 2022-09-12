const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('user')
    .setDescription('Replies with your user info')
    .addStringOption((option) => option.setName('input')
      .setDescription('Give the user which you want the id from')
      .setRequired(true)),
  async execute(interaction) {
    const targetUser = interaction.options.getString('input');

    const targetMemberId = interaction.client.users.resolveId(targetUser);
    const cleanedTargetMemberId = targetMemberId.slice(3, -1);

    if (typeof +cleanedTargetMemberId === 'number') {
      await interaction.reply(`The id for user ${targetUser} is ${cleanedTargetMemberId}`);
    } else {
      await interaction.reply('No user found!');
    }
  },
};
