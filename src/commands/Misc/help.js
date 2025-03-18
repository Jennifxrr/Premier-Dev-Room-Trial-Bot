module.exports = {
	name: 'help',
	description: 'View all the commands on the bot',
	async execute(client, interaction) {

		const embed = client.embed(true)
			.setTitle('/Help (6 Commands)')
			.setDescription([
				'**Misc Commands**',
				'`/help` - Shows all the commands on the bot.',
				'`/perm` - Set the permissions of a command.\n',
				'**Ticket Commands**',
				'`/add` - Add a user to a ticket channel.',
				'`/remove` - Remove a user from a ticket channel.',
				'`/close` - Close a ticket and send the transcript to the logs channel.',
				'`/panel` - Spawn in the panel that users will use to create a ticket.',
			].join('\n'));

		interaction.reply({ embeds: [embed], flags: 64 });

	},
};