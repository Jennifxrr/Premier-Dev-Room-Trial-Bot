const ticketModel = require('../../schemas/ticket');
const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
	name: 'add',
	description: 'Add a user to the ticket!',
	options: [
		{ name: 'user', type: ApplicationCommandOptionType.User, description: 'The user you want to add to the ticket!', required: true },
	],
	async execute(client, interaction) {

		const ticketDoc = await ticketModel.findOne({
			guildId: interaction.guild.id,
			channelId: interaction.channel.id,
		});

		if (!ticketDoc) {
			const noTicket = client.error('No Ticket Found', 'This command can only be ran in a ticket!');
			return interaction.reply({ embeds: [noTicket], flags: 64 });
		}

		const user = interaction.options.getUser('user');

		interaction.channel.permissionOverwrites.edit(user.id, { ViewChannel: true });

		const success = client.success('User Added', `Successfully added ${user} to the ticket!`);
		return interaction.reply({ embeds: [success] });

	},
};