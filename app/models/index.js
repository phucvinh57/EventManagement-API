const dbConfig = require('../config/db.config')
const dbModel = require('./db.model');
const mysql = require('mysql2');
const util = require('util');

const connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});

dbModel(util.promisify(
    connection.query
).bind(connection));

module.exports = connection;