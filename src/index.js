require('dotenv').config();

// Подключить библиотеки для работы с файлами
const fs = require('node:fs');
const path = require('node:path');

// Подключение необходимых классов из discord.js
const { Client, Collection, Intents } = require('discord.js');

// Создание клиента для дальнейших интеракций с API дискорда
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Создание коллекции с командами и добавлением всех комманд из ./commands
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

// Создание коллекции с эвентами и добавлением всех эвентов из ./events
client.events = new Collection();

const eventsPath = path.join(__dirname, 'events');
const eventsFiles = fs
	.readdirSync(eventsPath)
	.filter(file => file.endsWith('js'));

for (const file of eventsFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

// Подключение к дискорду
client.login(process.env.TOKEN);
