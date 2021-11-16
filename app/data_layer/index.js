const dbConfig = require('../config/db.config')
const { eventSchema, userSchema, invitationSchema } = require('./db.schema')
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

db = {}
db.connect = mongoose.connect
db.url = dbConfig.url;

db.Events = mongoose.model('Events', eventSchema);
db.Users = mongoose.model('Users', userSchema);
db.Invitations = mongoose.model('Invitations', invitationSchema);

module.exports = db;