const { ApplicationCommandOptionType } = require('discord.js');
const Welcome = require('../../models/welcome');

module.exports = {
	name: 'setwelcomemessage',
	description: 'Set the message that you would like to send when users join!',
	options: [
		{ name: 'message', type: ApplicationCommandOptionType.String, description: 'Your welcome message. (| = Line Down) ({usermention}, {username}, {servername}, {membercount})', required: true },
	],
	async execute(client, interaction) {

		try {

			const message = interaction.options.getString('message');

			let welcomeDoc = await Welcome.findOne({ where: { guildId: interaction.guild.id } });

			if (!welcomeDoc) {
				welcomeDoc = await Welcome.create({ guildId: interaction.guild.id, channelId: null, message: null });
			}

			welcomeDoc.message = message;
			await welcomeDoc.save();

			const messageformatted = message
				.replace('{usermention}', interaction.user)
				.replace('{username}', interaction.user.username)
				.replace('{servername}', interaction.guild.name)
				.replace('{membercount}', interaction.guild.memberCount);

			client.logger.info(`I have changed the welcome message to ${messageformatted}`);
			const success = client.success(`Successfully updated the welcome message to:\n\n${messageformatted.split('|').join('\n')}`);
			return interaction.reply({ embeds: [success], flags: 64 });

		}
		catch (e) {
			console.log(e);
			const error = client.error('There was an error setting the welcome message! Please check the console for errors.');
			return interaction.reply({ embeds: [error], flags: 64 });
		}


	},
};