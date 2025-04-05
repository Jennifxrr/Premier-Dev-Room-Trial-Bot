const Welcome = require('../../models/welcome');
const color = require('chalk');

module.exports = {
	name: 'guildMemberAdd',
	once: false,
	run: async (member) => {

		const welcomeDoc = await Welcome.findOne({ where: { guildId: member.guild.id } });

		if (!welcomeDoc) {
			console.log(color.hex('#ff0000').bold('X') + color.hex('#FFFFFF')(' A member joined, however your welcome system was not set up! Use the commands /setwelcomemessage and /setwelcomechannel to set the system up!'));
			return;
		}

		if (welcomeDoc.channelId == null || welcomeDoc.message == null) {
			console.log(color.hex('#ff0000').bold('X') + color.hex('#FFFFFF')(' A member joined, however your welcome system was not set up! Use the commands /setwelcomemessage and /setwelcomechannel to set the system up!'));
			return;
		}

		const welcomeChannel = await member.guild.channels.fetch(welcomeDoc.channelId).catch(() => null);

		if (!welcomeChannel) {
			console.log(color.hex('#ff0000').bold('X') + color.hex('#FFFFFF')(' The channel that you set up for your welcome message is invalid! Please set a new channel using /setwelcomechannel!'));
			return;
		}

		const welcomeMessage = welcomeDoc.message
			.replace('{usermention}', member)
			.replace('{username}', member.user.username)
			.replace('{servername}', member.guild.name)
			.replace('{membercount}', member.guild.memberCount);

		welcomeChannel.send({ content: welcomeMessage.split('|').join('\n') });

	},
};