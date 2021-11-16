const account = require('./account.router')
const auth = require('./auth.router')
const calendar = require('./calendar.router')
const event = require('./event.router')
const invite = require('./invite.router')
const sched = require('./sched.router')
const search = require('./search.router')

module.exports = {
    account, auth,
    calendar, event,
    invite,
    sched,
    search
}