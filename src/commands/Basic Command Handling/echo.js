const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
	name: 'echo',
	description: 'Have the bot repeat a message after you!',
	options: [
		{ name: 'message', type: ApplicationCommandOptionType.String, description: 'The message you would like the bot to repeat.', required: true },
		{ name: 'type', type: ApplicationCommandOptionType.String, description: 'The type of message you would like the bot to send.', required: true, choices: [ { name: 'Embeded', value: 'embed' }, { name: 'Normal', value: 'normal' } ] },
	],
	async execute(client, interaction) {

		const message = interaction.options.getString('message');
		const type = interaction.options.getString('type');

		try {

			if (type == 'embed') {

				const embed = client.embed(true);
				embed.setDescription(message);

				interaction.channel.send({ embeds: [embed] });

			}
			else {

				interaction.channel.send({ content: message });

			}

			const wordCount = message.split(/\s+/).filter(Boolean).length;

			const success = client.success(`Successfully echoed your message into the channel! There were **${wordCount}** word(s) in your message.`);
			return interaction.reply({ embeds: [success], flags: 64 });

		}
		catch (e) {
			console.log(e);
			const error = client.error('There was an error echoing the message! Please check the console for errors.');
			return interaction.reply({ embeds: [error], flags: 64 });
		}

	},
};