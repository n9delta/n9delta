// Подключить необходимые классы из библиотеки Discord.js
const { Client, Intents } = require('discord.js');

// Подключение FS и PATH для работы с файлами
const fs = require('node:fs');
const path = require('node:path');

// Создаём новое приложение клиента
const client = new Client({ intents: [Intents.FLAGS.GUILD] });

// Создание коллекции где будут хранится все команды, добавление в неё всех комманд по пути ./commands
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

// Когда клиент запущен, то ОДИН раз оповестить об этом
client.once('ready', () => {
	console.log('Client is ready!');
});

// Обработчик для всех взаимодействий
client.on('interactionCreate', i => {
	if (interaction.isCommand()) interactionCommandHandler(i);
});

async function interactionCommandHandler(i) {
	const command = client.commands.get(i.commandName);

	if (!command) return;

	try {
		await command.execute(i);
	} catch (err) {
		console.log(err);
		await i.reply({
			content:
				'Неизвестная ошибка при выполнении команды, обратитесь к администратору',
			ephemeral: true,
		});
	}
}

// Подключиться к дискорду используя токен
client.login(process.env.TOKEN);
