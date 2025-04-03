const { EmbedBuilder } = require('discord.js');

module.exports = (description) => {

	const embed = new EmbedBuilder()
		.setDescription(`**Error**: ${description}`)
		.setColor('#e60000');

	return embed;
};