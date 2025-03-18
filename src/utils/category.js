const { ChannelType } = require('discord.js');

module.exports = async (guild, category) => {

	let newCatName = category;

	let newCat = await guild.channels.cache.find(c => c.name === category && c.type === ChannelType.GuildCategory);
	if (!newCat) {
		newCat = await guild.channels.create({
			name: `${category}`,
			type: ChannelType.GuildCategory,
			permissionOverwrites: [{
				id: guild.id,
				deny: ['ViewChannel'],
			}],
		});
	}

	while (newCat.children && newCat.children.size >= 50) {
		newCatName = newCatName + 'I';
		newCat = await guild.channels.cache.find(c => c.name === newCatName && c.type === ChannelType.GuildCategory);
		if (!newCat) {
			newCat = await guild.channels.create({
				name: `${newCatName}`,
				type: ChannelType.GuildCategory,
				permissionOverwrites: [{
					id: guild.id,
					deny: ['ViewChannel'],
				}],
			});
		}
	}

	return newCat;

};