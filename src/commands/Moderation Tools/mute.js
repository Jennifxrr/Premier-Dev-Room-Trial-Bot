const { ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');
const ms = require('ms');

module.exports = {
	name: 'mute',
	description: 'Mute someone in the guild.',
	options: [
		{ name: 'user', type: ApplicationCommandOptionType.User, description: 'The user you would like to mute.', required: true },
		{ name: 'duration', type: ApplicationCommandOptionType.String, description: 'Duration of the mute (e.g. 10m, 1h)', required: true },
		{ name: 'reason', type: ApplicationCommandOptionType.String, description: 'The reason you are muting the user.', required: true },
	],
	async execute(client, interaction) {

		try {

			const user = interaction.options.getUser('user');
			const duration = interaction.options.getString('duration');
			const reason = interaction.options.getString('reason');

			const member = await interaction.guild.members.fetch(user.id).catch(() => null);

			if (!member) {
				const error = client.error('I could not find that user to mute!');
				return interaction.reply({ embeds: [error], flags: 64 });
			}

			if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
				const error = client.error('I do not have the permission to mute members!');
				return interaction.reply({ embeds: [error], flags: 64 });
			}

			if (!member.kickable) {
				const error = client.error('I am unable to mute that member!');
				return interaction.reply({ embeds: [error], flags: 64 });
			}

			if (member.id == interaction.user.id) {
				const error = client.error('You can not mute yourself!');
				return interaction.reply({ embeds: [error], flags: 64 });
			}

			if (member.roles.highest.position >= interaction.member.roles.highest.position) {
				const error = client.error('You can not mute someone with higher permissions than you!');
				return interaction.reply({ embeds: [error], flags: 64 });
			}

			const durationMs = ms(duration);

			if (!durationMs || durationMs < 5000) {
				const error = client.error('You must enter a valid duration above 5 seconds!');
				return interaction.reply({ embeds: [error], flags: 64 });
			}

			if (member.isCommunicationDisabled()) {
				const error = client.error(`${member} is already muted, therefore you can not mute them!`);
				return interaction.reply({ embeds: [error], flags: 64 });
			}

			await member.timeout(durationMs, reason);

			const title = client.config.muteTitle
				.replace('{username}', user.username);

			const description = client.config.muteDescription
				.replace('{usermention}', user)
				.replace('{username}', user.username)
				.replace('{reason}', reason)
				.replace('{moderatormention}', interaction.user)
				.replace('{moderatorusername}', interaction.user.username)
				.replace('{duration}', duration);

			const embed = client.embed()
				.setThumbnail(user.displayAvatarURL())
				.setTitle(title)
				.setDescription(description.split('|').join('\n'));

			interaction.reply({ embeds: [embed] });

			client.logger.info(`I have muted ${user.username} for ${reason} (${duration})`);
			const logsChannel = await interaction.guild.channels.cache.find(c => c.id === client.config.moderationLogs) || await interaction.guild.channels.cache.find(c => c.name === client.config.moderationLogs);

			if (logsChannel) {
				logsChannel.send({ embeds: [embed] });
			}

		}
		catch (e) {
			console.log(e);
			const error = client.error('There was an error muting the member! Please check the console for errors.');
			return interaction.reply({ embeds: [error], flags: 64 });
		}


	},
};