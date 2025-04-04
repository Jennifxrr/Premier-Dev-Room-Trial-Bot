const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Points = sequelize.define('Points', {
	guildId: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	memberId: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	points: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
});

module.exports = Points;