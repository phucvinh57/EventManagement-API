const dbConfig = require('../config/db.config')
const {eventSchema} = require('./db.model')
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

db = {}
db.connect = mongoose.connect
db.url = dbConfig.url;
// db.tutorials = require("./db.model.js")(mongoose);

db.Event = mongoose.model('Events', eventSchema);
// db.Event.create({
//   name: 'Họp đồ án',
//   date: new Date(),
//   location: 'Link',
//   description: 'Hay',
//   option: {
//     option: 1,
//     title: 'Hằng ngày'
//   }
// }, function (err, result) {
//   console.log(result);
// });

module.exports = db;