const { ApplicationCommandOptionType } = require('discord.js');
const Points = require('../../models/points');

module.exports = {
	name: 'getpoints',
	description: 'View how many points a user has!',
	options: [
		{ name: 'user', type: ApplicationCommandOptionType.User, description: 'The user you would like to view the points of!', required: true },
	],
	async execute(client, interaction) {

		try {

			const user = interaction.options.getUser('user');

			const member = await interaction.guild.members.fetch(user.id).catch(() => null);

			if (!member) {
				const error = client.error('There was an error trying to find that user!');
				return interaction.reply({ embeds: [error], flags: 64 });
			}

			const pointsDoc = await Points.findOne({ where: { guildId: interaction.guild.id, memberId: member.id } });

			if (!pointsDoc) {
				const error = client.error('This user has not recieved any points yet!');
				return interaction.reply({ embeds: [error], flags: 64 });
			}

			const success = client.success(`Successfully recieved the amount of points ${member} has! They have **${pointsDoc.points}** points!`);
			return interaction.reply({ embeds: [success], flags: 64 });

		}
		catch (e) {
			console.log(e);
			const error = client.error('There was an getting a user\'s points! Please check the console for errors.');
			return interaction.reply({ embeds: [error], flags: 64 });
		}


	},
};