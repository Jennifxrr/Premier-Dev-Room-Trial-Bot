const { ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');

module.exports = {
	name: 'removerole',
	description: 'Remove a role from a user.',
	options: [
		{ name: 'user', type: ApplicationCommandOptionType.User, description: 'The user you would like to remove a role from.', required: true },
		{ name: 'role', type: ApplicationCommandOptionType.Role, description: 'The role you would like to remove.', required: true },
	],
	async execute(client, interaction) {

		try {

			const user = interaction.options.getUser('user');
			const role = interaction.options.getRole('role');

			const member = await interaction.guild.members.fetch(user.id).catch(() => null);

			if (!member) {
				const error = client.error('There was an error trying to find that user!');
				return interaction.reply({ embeds: [error], flags: 64 });
			}

			if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
				const error = client.error('I do not have the permission to manage roles!');
				return interaction.reply({ embeds: [error], flags: 64 });
			}

			if (interaction.guild.members.me.roles.highest.position <= role.position) {
				const error = client.error('I can not remove this role as it is higher than my highest role!');
				return interaction.reply({ embeds: [error], flags: 64 });
			}

			if (!member.roles.cache.has(role.id)) {
				const error = client.error(`${member} does not have the ${role} role!`);
				return interaction.reply({ embeds: [error], flags: 64 });
			}

			await member.roles.remove(role);

			client.logger.info(`I have removed the ${role.name} role from ${user.username}`);
			const success = client.success(`I have succesfully removed the ${role} role from ${member}!`);
			return interaction.reply({ embeds: [success], flags: 64 });

		}
		catch (e) {
			console.log(e);
			const error = client.error('There was an error removing the role from the user! Please check the console for errors.');
			return interaction.reply({ embeds: [error], flags: 64 });
		}


	},
};