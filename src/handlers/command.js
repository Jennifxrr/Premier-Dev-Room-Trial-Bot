const { readdirSync } = require('fs');
const wait = require('node:timers/promises').setTimeout;

module.exports = async client => {

	let count = 0;

	readdirSync('./src/commands/').forEach(folder => {

		const commands = readdirSync(`./src/commands/${folder}/`).filter(file => file.endsWith('.js'));

		for (const command of commands) {
			const file = require(`../commands/${folder}/${command}`);
			count = count += 1;
			client.commands.set(file.name, file);

			const data = {
				name: file.name,
				description: file.description || 'No Description',
				options: file.options ? file.options : [],
			};

			client.guilds.cache.forEach(guild => {

				guild.commands.create(data)
					.catch(() => {
						return;
					});

			});

		}

	});

	await wait(1000);

	console.log(client.color.hex('#008000').bold('✔') + client.color.hex('#FFFFFF')(` ${count} commands loaded successfully!`));


};

