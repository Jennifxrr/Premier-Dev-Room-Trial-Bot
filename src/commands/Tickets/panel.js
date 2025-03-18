const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	name: 'panel',
	description: 'Create the ticket creation panel.',
	async execute(client, interaction) {

		let color;

		switch (client.config.ticketButtonColor.toLowerCase()) {
		case 'blue':
			color = ButtonStyle.Primary;
			break;
		case 'red':
			color = ButtonStyle.Danger;
			break;
		case 'green':
			color = ButtonStyle.Success;
			break;
		default:
			color = ButtonStyle.Secondary;
			break;
		}

		const row = new ActionRowBuilder();

		row.addComponents(
			new ButtonBuilder()
				.setCustomId('createticket')
				.setEmoji(client.config.ticketButtonEmoji)
				.setLabel(client.config.ticketButtonName)
				.setStyle(color),
		);

		const embed = client.embed(true)
			.setTitle(client.config.panelEmbedTitle)
			.setDescription(client.config.panelEmbedDescription);

		interaction.channel.send({ embeds: [embed], components: [row] })
			.then(() => {
				const success = client.success('Ticket Panel Posted', 'Successfully posted the ticket creation panel!');
				return interaction.reply({ embeds: [success], flags: 64 });
			})
			.catch((e) => {
				const error = client.error('Configuration Error', 'There was an issue with posting the ticket creation panel!');
				console.log(e);
				return interaction.reply({ embeds: [error], flags: 64 });
			});

	},
};