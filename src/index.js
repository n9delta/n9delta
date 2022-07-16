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

// ОДИН раз при старте клиент сообщить об этом в консоль
client.once('ready', () => {
	console.log('Ready!');
});

// Обработчик взаимодействий
client.on('interactionCreate', async i => {
	if (!i.isCommand()) return;

	const command = client.commands.get(i.commandName);

	if (!command) return;

	try {
		await command.execute(i);
	} catch (error) {
		console.error(error);
		await i.reply({
			content: 'Неизвестная ошибка, свяжитесь с администратором!',
			ephemeral: true,
		});
	}
});

// Подключение к дискорду
client.login(process.env.TOKEN);
