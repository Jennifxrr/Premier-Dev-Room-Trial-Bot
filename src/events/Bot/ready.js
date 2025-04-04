const { readdir } = require('fs');
const { connectDB } = require('../../utils/database');
const Welcome = require('../../models/welcome');
const Points = require('../../models/points');

module.exports = {
	name: 'ready',
	once: true,
	run: async (client) => {

		console.log(client.color.hex('#008000').bold('✔') + client.color.hex('#FFFFFF')(` I have successfully been logged in as ${client.user.tag}`));

		await connectDB();

		Welcome.sync();
		Points.sync();

		readdir('./commands.', () => {
			const cHandler = require('../../handlers/command');
			cHandler(client);
		});

		console.log(client.color.hex('FFFF00').bold('?') + client.color.hex('#FFFFFF')(` I am in ${client.guilds.cache.size} guild(s)!`));

	},
};
