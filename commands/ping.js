const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	name: 'ping',
	description: 'Pong! See how fast this stuff responds...',
	response: {
		text: async function() {
			return 'Pong! Checking response';
		},
		type: 'reply',
		then: function(client, message, interaction) {
			if (interaction) {
				if (this.type == 'reply') {
					interaction.editReply(`Roundtrip latency: ${message.createdTimestamp - interaction.createdTimestamp}. Websocket: ${client.ws.ping}ms`);
				}
				else {
					message.edit(`Roundtrip latency: ${message.createdTimestamp - interaction.createdTimestamp}ms. Websocket: ${client.ws.ping}ms`);
				}
			}
			else {
				if (this.type == 'reply') {
					message.edit(`Roundtrip latency: ${Date.now() - message.createdTimestamp}ms. Websocket: ${client.ws.ping}ms`);
				}
				else {
					message.edit(`Roundtrip latency: ${Date.now() - message.createdTimestamp}ms. Websocket: ${client.ws.ping}ms`);
				}
			}
		},
		data: new SlashCommandBuilder()
			.setName('ping')
			.setDescription('Replies with Pong!'),
	}
};