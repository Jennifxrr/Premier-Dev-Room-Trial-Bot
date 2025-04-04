const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Welcome = sequelize.define('Welcome', {
	guildId: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	channelId: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	message: {
		type: DataTypes.STRING,
		allowNull: true,
	},
});

module.exports = Welcome;