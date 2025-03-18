const ticketModel = require('../../schemas/ticket');

module.exports = {
	name: 'interactionCreate',
	once: false,
	run: async (interaction, client) => {

		if (interaction.isCommand()) return;

		if (interaction.customId == 'createticket') {

			const ticketFound = await ticketModel.find({
				guildId: interaction.guild.id,
				authorId: interaction.user.id,
			});

			if (ticketFound.length >= client.config.maxTickets) {
				const alreadyTicket = client.error('Too Many Tickets Open!', `You can only have \`${client.config.maxTickets}\` tickets opened at a time!`);
				return interaction.reply({ embeds: [alreadyTicket], flags: 64 });
			}

			const category = await client.category(interaction.guild, client.config.ticketCategory);

			const map = client.config.ticketPermissions.map((id) => ({ allow: ['ViewChannel', 'AttachFiles'], id }));

			const ticketChannel = await interaction.guild.channels.create({
				name: `${client.config.ticketSuffix}-${interaction.user.username}`,
				parent: category.id,
				permissionOverwrites: [
					{
						allow: ['ViewChannel', 'AttachFiles'],
						id: interaction.user.id,
					},
					{
						deny: ['ViewChannel', 'AttachFiles'],
						id: interaction.guild.id,
					},
					...map,
				],
			});

			const ticketCreated = client.success('Ticket Created!', `Successfully created a ticket for you!: ${ticketChannel}`);
			interaction.reply({ embeds: [ticketCreated], flags: 64 });

			const ticketEmbed = client.embed()
				.setTitle(`${interaction.user.username}'s ${client.config.ticketSuffix} ticket`)
				.setDescription(`${client.config.ticketWelcome}`)
				.setThumbnail(interaction.user.displayAvatarURL());

			ticketChannel.send({ content: `${interaction.user}`, embeds: [ticketEmbed] });


			ticketModel.create({
				guildId: interaction.guild.id,
				channelId: ticketChannel.id,
				authorId: interaction.user.id,
			});
		}
	},
};
