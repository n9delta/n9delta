require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, supportGuildId } = require('../../config.json');
const token = process.env.TOKEN;

const commands = [];
const commandsPath = path.join(__dirname, '../commands');
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./../commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

rest
	.put(Routes.applicationGuildCommands(clientId, supportGuildId), {
		body: commands,
	})
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
