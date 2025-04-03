const { EmbedBuilder } = require('discord.js');

module.exports = (description) => {

	const embed = new EmbedBuilder()
		.setDescription(`**Success**: ${description}`)
		.setColor('#008000');

	return embed;
};