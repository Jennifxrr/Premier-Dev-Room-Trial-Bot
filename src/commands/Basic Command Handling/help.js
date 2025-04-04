module.exports = {
	name: 'help',
	description: 'View all the commands on the bot',
	async execute(client, interaction) {

		try {

			const embed = client.embed(true)
				.setTitle('/Help (13 Commands)')
				.setDescription([
					'**Basic Commmand Handling**',
					'`/echo` - Have the bot repeat after you, either in a normal or embedded message.',
					'`/hello` - Have the bot greet you!',
					'`/help` - View all the commands the bot has to offer.\n',
					'**Data Management**',
					'`/addpoints` - Add points to a user.',
					'`/getpoints` - View how many points a user has.',
					'`/setwelcomechannel` - Set the channel that welcome messages get sent to.',
					'`/setwelcomemessage` - Set the message that gets sent when a user joins the guild.\n',
					'**Moderation Tools**',
					'`/ban` - Ban a user from the guild.',
					'`/kick` - Kick a user from the guild.',
					'`/mute` - Mute a user in the guild.\n',
					'**Role Management**',
					'`/assignrole` - Assign a role to a user.',
					'`/removerole` - Remove a role from a user.\n',
					'**User Integration**',
					'`/userinfo` - View the information of a user in the guild.',
				].join('\n'));

			interaction.reply({ embeds: [embed], flags: 64 });

		}
		catch (e) {
			console.log(e);
			const error = client.error('There was an error sending the message! Please check the console for errors.');
			return interaction.reply({ embeds: [error], flags: 64 });
		}

	},
};