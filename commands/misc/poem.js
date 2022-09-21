const fetch = require('node-fetch');
const { SlashCommandBuilder } = require('discord.js');

const requestPoem = async (title) => {
  let poem;
  try {
    let response
    if (title) {
      response = await fetch(`https://poetrydb.org/title,poemcount/${title};1/author,title,lines.text`);
    } else {
      response = await fetch('https://poetrydb.org/random/1/title,author,lines.text')
    }
    const body = await response.text();
    if (body.includes('"status":404')) {
      throw new Error('404');
    }
    poem = body;
  } catch (err) {
    poem = false;
  }
  return poem;
};

const locateBreakPos = (poem, currentPos) => {
  let count = currentPos;
  let positionFound = false;

  while (!positionFound && count > currentPos - 500) {
    if (poem[count] === '\n' && poem[count - 1] === '\n') {
      positionFound = true;
    } else {
      count -= 1;
    }
  }
  if (count === currentPos - 500) {
    return currentPos;
  }
  return count;
};

const splitPoem = (poem) => {
  const arrayOfDivisions = [];
  const { length } = poem;
  // Starts at 6 to skip 'lines' which is part of response text
  let position = 0;
  let lastDivision = false;
  while (!lastDivision) {
    const cutOfPoint = locateBreakPos(poem, position + 2000);
    arrayOfDivisions.push(poem.slice(position, cutOfPoint));
    position = cutOfPoint;
    if (length - position < 2000) {
      lastDivision = true;
    }
  }
  arrayOfDivisions.push(poem.slice(position, -1));

  return arrayOfDivisions;
};

const formatPoem = (poem) => {
  const endOfHeadersPos = poem.indexOf('lines\n');
  const headers = poem.slice(0, endOfHeadersPos + 5);
  const poemWithoutHeaders = poem.replace(headers, '');
  const endOfTitle = headers.indexOf('author\n');
  const title = `**${headers.slice(6, endOfTitle - 1)}**`;

  const author = `**${headers.slice(endOfTitle + 7, headers.length - 5)}**`;

  return `${title}\n*by*\n${author}${poemWithoutHeaders}`;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('get-poem')
    .setDescription('Responds with a poem that matches given title')
    .addStringOption((option) => option.setName('title')
      .setDescription('The title of the poem you want')),
  async execute(interaction) {
    const poem = await requestPoem(interaction.options.getString('title'));

    if (poem.length < 2000 && typeof poem === 'string') {
      const formattedPoem = formatPoem(poem);
      await interaction.reply(formattedPoem);
    } else if (poem.length > 2000 && typeof poem === 'string') {
      const arrayOfDivisions = splitPoem(poem);

      for (let i = 0; i < arrayOfDivisions.length; i += 1) {
        if (i === 0) {
          const poemDivision = arrayOfDivisions[i];
          const formattedDivision = formatPoem(poemDivision);
          await interaction.reply(formattedDivision);
        } else {
          await interaction.followUp(arrayOfDivisions[i]);
        }
      }
    } else {
      await interaction.reply('Could not find poem');
    }
  },
};
