const transcript = require('discord-html-transcripts');
const ticketModel = require('../../schemas/ticket');
const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
	name: 'close',
	description: 'Close a ticket.',
	options: [
		{ name: 'reason', type: ApplicationCommandOptionType.String, description: 'The reason for the ticket being closed.' },
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

		const reason = interaction.options.getString('reason') || 'No Reason Specified';

		const logChannel = interaction.guild.channels.cache.find(c => c.id === client.config.ticketLogsChannel) || interaction.guild.channels.cache.find(c => c.name === client.config.ticketLogsChannel);

		if (logChannel) {

			const attachment = await transcript.createTranscript(interaction.channel);

			const user = await client.users.fetch(ticketDoc.authorId).catch(() => {return;});

			const embed = client.embed(true)
				.setTitle(`${interaction.channel.name} Was Closed!`)
				.addFields([
					{ name: 'Ticket Created', value: `${user.tag || 'N/A'}` },
					{ name: 'Closed By', value: `${interaction.user.tag} (${reason})` },
				]);

			logChannel.send({ embeds: [embed], files: [attachment] });
			user.send({ embeds: [embed], files: [attachment] }).catch(() => {return;});

			await ticketDoc.deleteOne();
			interaction.channel.delete();

		}
		else {

			const noLogs = client.error('Channel Not Found', 'The ticket logs channel is not correctly configured correctly! Please fix this before trying to close a ticket so you do not lose the transcript!');
			return interaction.reply({ embeds: [noLogs], flags: 64 });

		}


	},
};