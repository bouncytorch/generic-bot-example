const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json'));
const { SlashCommandBuilder } = require('@discordjs/builders');
const Keyv = require('keyv');
const keyv = new Keyv(`${config.prefix.database.type}://${config.prefix.database.username}:${config.prefix.database.password}@${config.prefix.database.host}:${config.prefix.database.port}/${config.prefix.database.name}`);
module.exports = {
	name: 'prefix',
	description: 'Change bot\'s prefix in this particular server... Type reset to reset prefix.',
	response: {
		text: async function(cli, message, interaction, args) {
			if (!interaction) {
				if (!args[0]) {
					if ((await keyv.get(message.guildId))) {
						return 'Current prefix is `' + await keyv.get(message.guildId) + '`';
					}
					else return 'Current prefix is `' + config.prefix.default + '`';
				}
				if (args.length > 1) return 'Too many prefixes provided.';
				if (args[0] == config.prefix.default || args[0] == 'reset') {
					keyv.delete(message.guildId);
					return 'Prefix reset';
				}
				else {
					keyv.set(message.guildId, args[0]);
					return 'Prefix set. (`' + args[0] + '`)';
				}
			}
			else {
				if (!interaction.options.getString('prefix')) {
					if ((await keyv.get(interaction.guildId))) {
						return 'Current prefix is `' + await keyv.get(interaction.guildId) + '`';
					}
					else return 'Current prefix is `' + config.prefix.default + '`';
				}
				if (interaction.options.getString('prefix') == config.prefix.default || interaction.options.getString('prefix') == 'reset') {
					keyv.delete(interaction.guildId);
					return 'Prefix reset';
				}
				else {
					keyv.set(interaction.guildId, interaction.options.getString('prefix'));
					return 'Prefix set. (`' + interaction.options.getString('prefix') + '`)';
				}
			}
		},
		type: 'send',
		then: function() {
			return;
		},
		data: new SlashCommandBuilder()
			.setName('prefix')
			.setDescription('Change bot\'s prefix in this particular server... Type reset to reset prefix.')
			.addStringOption(option => option.setName('prefix').setDescription('Set a prefix (Or type reset to reset)').setRequired(false)),
	}
};