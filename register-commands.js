const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const dotenv = require('dotenv');
const fs = require('node:fs');
const path = require('node:path')

dotenv.config({ path: './config.env' });

const token = process.env.BOT_TOKEN

const commands = [];

// Place your client and guild ids here
const clientId = process.env.BOT_CLIENT_ID;

const commandDirectories = ['misc', 'music']

for (let i = 0; i < commandDirectories.length; i++) {

	const dirCommandsPath = path.join('commands', commandDirectories[i])
	const dirCommandFiles = fs.readdirSync(dirCommandsPath).filter(file => file.endsWith('.js'));

	for (const file of dirCommandFiles) {
		const command = require(path.join(__dirname, dirCommandsPath, file));
		console.log(command.data.toJSON())
		commands.push(command.data.toJSON());
	}
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();