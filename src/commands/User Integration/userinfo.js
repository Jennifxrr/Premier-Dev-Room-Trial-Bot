const { ApplicationCommandOptionType } = require('discord.js');
const moment = require('moment');

module.exports = {
	name: 'userinfo',
	description: 'View the user information of someone in the guild.',
	options: [
		{ name: 'user', type: ApplicationCommandOptionType.User, description: 'The user you would like to view the information of.', required: false },
	],
	async execute(client, interaction) {

		try {

			const user = interaction.options.getUser('user') || interaction.user;

			const member = await interaction.guild.members.fetch(user.id).catch(() => null);

			if (!member) {
				const error = client.error('There was an error trying to find that user\'s information!');
				return interaction.reply({ embeds: [error], flags: 64 });
			}

			const roles = member.roles.cache.map(role => role).join(', ');

			const joinDate = moment(user.joinedAt).format('MMMM Do, YYYY');

			const title = client.config.userInfoTitle
				.replace('{username}', user.username);

			const description = client.config.userInfoDescription
				.replace('{username}', user.username)
				.replace('{botstatus}', `${user.bot ? '✅' : '❌'}`)
				.replace('{userid}', user.id)
				.replace('{userjoin}', joinDate)
				.replace('{roles}', roles);

			const embed = client.embed()
				.setThumbnail(user.displayAvatarURL())
				.setTitle(title)
				.setDescription(description.split('|').join('\n'));

			interaction.reply({ embeds: [embed] });

		}
		catch (e) {
			console.log(e);
			const error = client.error('There was an error sending the message! Please check the console for errors.');
			return interaction.reply({ embeds: [error], flags: 64 });
		}


	},
};