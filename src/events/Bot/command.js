const { PermissionsBitField } = require('discord.js');
const { readFileSync } = require('fs');
const perms = JSON.parse(readFileSync('./configuration/permissions.json', 'utf8'));

module.exports = {
	name: 'interactionCreate',
	once: false,
	run: async (interaction, client) => {

		if (!interaction.isCommand()) return;

		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		const args = [];

		for (const option of interaction.options.data) {
			if (option.type === 'SUB_COMMAND') {
				option.options?.forEach((x) => {
					if (x.value) args.push(option.value);
				});
			}
			else {
				args.push(option.value);
			}
		}

		if (!perms[interaction.commandName]) {
			const error = client.error(`There are no permissions set up for the **${interaction.commandName}** command!`);
			return interaction.reply({ embeds: [error], flags: 64 });
		}

		if (!interaction.memberPermissions.has(PermissionsBitField.Flags.Administrator) && !interaction.member.roles.cache.find(r => perms[interaction.commandName].perms.includes(r.id))) {
			const error = client.error(`You do not have the permission to run the **${interaction.commandName}** command!`);
			return interaction.reply({ embeds: [error], flags: 64 });
		}


		command.execute(client, interaction, args);

		client.logger.info(`${interaction.user.username} has ran the /${interaction.commandName} command in ${interaction.guild.name}`);

	},
};