const dbConfig = require('../config/db.config')

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

db = {}

db.mongoose = mongoose;
db.url = dbConfig.url;
db.tutorials = require("./db.model.js")(mongoose);

module.exports = db;