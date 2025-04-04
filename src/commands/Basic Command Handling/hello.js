module.exports = {
	name: 'hello',
	description: 'Greet yourself',
	async execute(client, interaction) {

		try {

			const randomEmoji = client.config.emojiList[Math.floor(Math.random() * client.config.emojiList.length)];

			const msg = client.config.friendlyGreeting
				.replace('{username}', interaction.user.username)
				.replace('{emoji}', randomEmoji);

			await interaction.reply({ content: msg });

		}
		catch (e) {
			console.log(e);
			const error = client.error('There was an error sending the message! Please check the console for errors.');
			return interaction.reply({ embeds: [error], flags: 64 });
		}

	},
};