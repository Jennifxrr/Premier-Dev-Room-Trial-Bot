const ticketModel = require('../../schemas/ticket');
const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
	name: 'remove',
	description: 'Remove a user from the ticket!',
	options: [
		{ name: 'user', type: ApplicationCommandOptionType.User, description: 'The user you want to remove from the ticket!', required: true },
	],
	async execute(client, interaction) {

		const ticketDoc = await ticketModel.findOne({
			guildId: interaction.guild.id,
			channelId: interaction.channel.id,
		});

		if (!ticketDoc) {
			const noTicket = client.error('No Ticket Found', 'This command can only be ran in a ticket!');
			return interaction.reply({ embeds: [noTicket] });
		}

		const user = interaction.options.getUser('user');

		interaction.channel.permissionOverwrites.edit(user.id, { ViewChannel: false });

		const success = client.success('User Removed', `Successfully removed ${user} from the ticket!`);
		return interaction.reply({ embeds: [success] });

	},
};