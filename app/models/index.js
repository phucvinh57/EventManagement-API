const dbConfig = require('../config/db.config')
const dbDefine = require('./db.define');
const mysql = require('mysql2');
const util = require('util');

const connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});

// Define Database
dbDefine(util.promisify(
    connection.query
).bind(connection));

module.exports = connection;