const { Schema, model } = require('mongoose');

const ticketSchema = new Schema({
	guildId: String,
	channelId: String,
	authorId: String,
});

module.exports = model('tickets', ticketSchema);