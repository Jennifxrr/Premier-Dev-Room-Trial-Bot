const { ApplicationCommandOptionType } = require('discord.js');
const Points = require('../../models/points');

module.exports = {
	name: 'addpoints',
	description: 'Add points to a user!',
	options: [
		{ name: 'user', type: ApplicationCommandOptionType.User, description: 'The user you would like to add points to!', required: true },
		{ name: 'points', type: ApplicationCommandOptionType.Integer, description: 'The amount of points you would like to add to the user', required: true },
	],
	async execute(client, interaction) {

		try {

			const user = interaction.options.getUser('user');
			const pointsToAdd = interaction.options.getInteger('points');

			const member = await interaction.guild.members.fetch(user.id).catch(() => null);

			if (!member) {
				const error = client.error('There was an error trying to find that user!');
				return interaction.reply({ embeds: [error], flags: 64 });
			}

			if (pointsToAdd < 1) {
				const error = client.error('You must specify a number greater than 0 to add points!');
				return interaction.reply({ embeds: [error], flags: 64 });
			}

			let pointsDoc = await Points.findOne({ where: { guildId: interaction.guild.id, memberId: member.id } });

			if (!pointsDoc) {
				pointsDoc = await Points.create({ guildId: interaction.guild.id, memberId: member.id, points: 0 });
			}

			pointsDoc.points = pointsDoc.points += pointsToAdd;
			await pointsDoc.save();

			client.logger.info(`I have added ${pointsToAdd} points to ${interaction.user.username}`);
			const success = client.success(`Successfully added **${pointsToAdd}** points to ${member}! They now have **${pointsDoc.points}** points!`);
			return interaction.reply({ embeds: [success], flags: 64 });


		}
		catch (e) {
			console.log(e);
			const error = client.error('There was an error adding points to the user! Please check the console for errors.');
			return interaction.reply({ embeds: [error], flags: 64 });
		}


	},
};