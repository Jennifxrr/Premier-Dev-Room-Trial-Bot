const { Sequelize } = require('sequelize');
const color = require('chalk');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
	host: process.env.DB_HOST,
	dialect: process.env.DB_DIALECT,
	logging: false,
});

async function connectDB() {
	try {
		await sequelize.authenticate();
		console.log(color.hex('#008000').bold('✔') + color.hex('#FFFFFF')(' I have connected to the database!'));
	}
	catch (e) {
		console.log(color.hex('#ff0000').bold('X') + color.hex('#FFFFFF')(' I have failed to connect to the database!'));
		console.log(e);
	}
}

module.exports = { sequelize, connectDB };