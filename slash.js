const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const fs = require('fs');

const _commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const config = JSON.parse(fs.readFileSync('./config.json'));

let commands = [];

for (const file of _commands) {
	const command = require(`./commands/${file}`);
	commands.push(command.response.data);
}

const rest = new REST({ version: '9' }).setToken(config.token);

rest.put(Routes.applicationCommands(config.client_id), { body: commands }).then(() => console.log('Commands set.')).catch(console.error);