const dbConfig = require('../config/db.config')
const schemas = require('./db.schema')
const mongoose = require('mongoose');

class DB {
    #uri;
    constructor(uri) {
        this.#uri = uri
    }
    Events = mongoose.model('events', schemas.event)
    Users = mongoose.model('Users', schemas.user)
    Invitations = mongoose.model('Invitations', schemas.invitation)
    connect = () => {
        mongoose.connect(this.#uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => {
            console.log("Mongo Database connected")
        }).catch((err) => {
            console.log("Cannot connect to the Mongo database")
            process.exit()
        })
    }
}

module.exports = new DB(dbConfig.uri);