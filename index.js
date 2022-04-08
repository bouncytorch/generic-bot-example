require('./slash.js');

const Discord = require('discord.js');
const fs = require('fs');
const Keyv = require('keyv');

const config = JSON.parse(fs.readFileSync('./config.json'));
const _commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const keyv = new Keyv(`${config.prefix.database.type}://${config.prefix.database.username}:${config.prefix.database.password}@${config.prefix.database.host}:${config.prefix.database.port}/${config.prefix.database.name}`);
const client = new Discord.Client({ intents: 98187 });
var commands = new Discord.Collection();

for (const file of _commands) {
	const command = require(`./commands/${file}`);
	commands.set(command.name, command);
}

client.on('interactionCreate', async interaction => {
	if (interaction.user.bot) return;
	if (interaction.isCommand()) {
		const cmd = commands.get(interaction.commandName);
		if (!cmd) return;
		interaction.reply({ content: await cmd.response.text(client, undefined, interaction, undefined), fetchReply: true }).then((msg) => cmd.response.then(client, msg, interaction, undefined));
	}
});

client.on('messageCreate', async (message) => {
	let slice;
	if (message.author.bot) return;
	if (!message.content.startsWith(config.prefix.default) && !((await keyv.get(message.guildId) && message.content.startsWith(await keyv.get(message.guildId))))) return;
	if ((await keyv.get(message.guildId))) slice = message.content.slice((await keyv.get(message.guildId)).length);
	else slice = message.content.slice(config.prefix.default.length);
	const args = slice.split(/ +/);
	const name = args.shift();
	const cmd = commands.get(name);
	if (!cmd) return;
	if (cmd.response.type == 'reply') message.reply({ content: await cmd.response.text(client, message, undefined, args), fetchReply: true }).then((msg) => cmd.response.then(client, msg, undefined, args));
	else message.channel.send(await cmd.response.text(client, message, undefined, args)).then((msg) => cmd.response.then(client, msg, undefined, args));
});

client.on('ready', () => console.log('Ready!'));
client.login(config.token);
