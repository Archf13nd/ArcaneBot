const path = require('node:path')
const fs = require('node:fs')

const { Client, GatewayIntentBits, Collection} = require('discord.js');



const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const token = process.env.BOT_TOKEN

const readyEvent = require('./events/ready')
const interactionCreateEvent = require('./events/interactionCreate')


// -----------------------------------
// Create new client instance
// -----------------------------------
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]});



// -----------------------------------
// Create new collection for all commands
// -----------------------------------
client.commands = new Collection()

// Add new command folders here
const commandDirectories = ['misc', 'music']

for (let i = 0; i < commandDirectories.length; i++) {
	const dirCommandsPath = path.join(__dirname, 'commands', commandDirectories[i])
	const dirCommandFiles = fs.readdirSync(dirCommandsPath).filter(file => file.endsWith('.js'));

	for (const file of dirCommandFiles) {
		const filePath = path.join(dirCommandsPath, file);
		const command = require(filePath);
		client.commands.set(command.data.name, command);
	}
}



// -----------------------------------
// Create event listeners
// -----------------------------------
client.once(readyEvent.name, (...args) => readyEvent.execute(...args))
client.on(interactionCreateEvent.name, (...args) => interactionCreateEvent.execute(...args))

// -----------------------------------
// Unhandled Rejection Error Handler
// -----------------------------------
process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

// -----------------------------------
// Login to Discord
// -----------------------------------
client.login(token);