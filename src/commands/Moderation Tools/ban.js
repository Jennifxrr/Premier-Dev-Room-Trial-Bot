const { ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');

module.exports = {
	name: 'ban',
	description: 'Ban someone from the guild.',
	options: [
		{ name: 'user', type: ApplicationCommandOptionType.User, description: 'The user you would like to ban.', required: true },
		{ name: 'reason', type: ApplicationCommandOptionType.String, description: 'The reason you are banning the user.', required: true },
	],
	async execute(client, interaction) {

		try {

			const user = interaction.options.getUser('user');
			const reason = interaction.options.getString('reason');

			const member = await interaction.guild.members.fetch(user.id).catch(() => null);

			if (!member) {
				const error = client.error('I could not find that user to ban!');
				return interaction.reply({ embeds: [error], flags: 64 });
			}

			if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
				const error = client.error('I do not have the permission to ban members!');
				return interaction.reply({ embeds: [error], flags: 64 });
			}

			if (!member.kickable) {
				const error = client.error('I am unable to ban that member!');
				return interaction.reply({ embeds: [error], flags: 64 });
			}

			if (member.id == interaction.user.id) {
				const error = client.error('You can not ban yourself!');
				return interaction.reply({ embeds: [error], flags: 64 });
			}

			if (member.roles.highest.position >= interaction.member.roles.highest.position) {
				const error = client.error('You can not ban someone with higher permissions than you!');
				return interaction.reply({ embeds: [error], flags: 64 });
			}

			await member.ban({ reason });

			const title = client.config.banTitle
				.replace('{username}', user.username);

			const description = client.config.banDescription
				.replace('{usermention}', user)
				.replace('{username}', user.username)
				.replace('{reason}', reason)
				.replace('{moderatormention}', interaction.user)
				.replace('{moderatorusername}', interaction.user.username);

			const embed = client.embed()
				.setThumbnail(user.displayAvatarURL())
				.setTitle(title)
				.setDescription(description.split('|').join('\n'));

			interaction.reply({ embeds: [embed] });

			client.logger.info(`I have banned ${user.username} for ${reason}`);
			const logsChannel = await interaction.guild.channels.cache.find(c => c.id === client.config.moderationLogs) || await interaction.guild.channels.cache.find(c => c.name === client.config.moderationLogs);

			if (logsChannel) {
				logsChannel.send({ embeds: [embed] });
			}

		}
		catch (e) {
			console.log(e);
			const error = client.error('There was an error banning the member! Please check the console for errors.');
			return interaction.reply({ embeds: [error], flags: 64 });
		}


	},
};