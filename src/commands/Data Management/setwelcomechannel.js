const { ApplicationCommandOptionType, ChannelType } = require('discord.js');
const Welcome = require('../../models/welcome');

module.exports = {
	name: 'setwelcomechannel',
	description: 'Set the channel that you would like welcome messages to send to!',
	options: [
		{ name: 'channel', type: ApplicationCommandOptionType.Channel, description: 'The channel you would like welcome messages to send to.', required: true },
	],
	async execute(client, interaction) {

		try {

			const channel = interaction.options.getChannel('channel');

			if (channel.type !== ChannelType.GuildText) {
				const error = client.error('You must select a **Text Channel** for the welcome message!');
				return interaction.reply({ embeds: [error], flags: 64 });
			}

			let welcomeDoc = await Welcome.findOne({ where: { guildId: interaction.guild.id } });

			if (!welcomeDoc) {
				welcomeDoc = await Welcome.create({ guildId: interaction.guild.id, channelId: null, message: null });
			}

			welcomeDoc.channelId = channel.id;
			await welcomeDoc.save();

			client.logger.info(`I have set the welcome channel to ${channel.name}`);
			const success = client.success(`Successfully updated the welcome channel to: ${channel}!`);
			return interaction.reply({ embeds: [success], flags: 64 });

		}
		catch (e) {
			console.log(e);
			const error = client.error('There was an error setting the welcome channel! Please check the console for errors.');
			return interaction.reply({ embeds: [error], flags: 64 });
		}


	},
};