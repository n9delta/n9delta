async function interactionCommandHandler(client, i) {
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
}

module.exports = { interactionCommandHandler };
