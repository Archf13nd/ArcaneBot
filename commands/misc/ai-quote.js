const { SlashCommandBuilder } = require('discord.js');
const puppeteer = require('puppeteer');

const inpirobotURL = 'https://inspirobot.me/';

const scrapeQuote = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(inpirobotURL);
  await page.click('.btn-generate');
  await page.waitForNetworkIdle({ idleTime: 1000 });
  const img = await page.$('.generated-image');
  const imgURL = await img.getProperty('src');
  const imgURLText = await imgURL.jsonValue();
  return imgURLText;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('get-quote')
    .setDescription('Returns an ai generated quote from Inspirobot.com'),
  async execute(interaction) {
    await interaction.deferReply();
    const url = await scrapeQuote();
    if (url) {
      await interaction.editReply(url);
    } else {
      await interaction.reply('Timed Out');
    }
  },
};
