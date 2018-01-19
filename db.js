
const Sequelize = require('sequelize');// note capital on S - constructor function
// to connect const connection = new Sequelize('name of db', 'name of user', 'password', {dialect: type of database engine you are trying to connect to})
const connection = new Sequelize('niktechnopro', 'niktechnopro', '', {host: 'localhost', dialect: 'postgres'})//setting up parameters for database

module.exports = connection;
