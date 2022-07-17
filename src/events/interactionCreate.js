const {
	interactionCommandHandler,
} = require('./../handlers/interactionCommandHandler');

module.exports = {
	name: 'interactionCreate',
	once: false,
	execute(i, client) {
		if (i.isCommand()) interactionCommandHandler(client, i);
	},
};
