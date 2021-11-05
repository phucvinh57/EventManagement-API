const db = require('../models')

const getBasicEvent = async function(req, res) {
    const event = await db.Event.find({_id: req.query.id});
    res.send(event);
}

const getFullEvent = function(req, res) {
    res.json({
        msg: "Get full event info"
    })
}

const getEventInvitations = function(req, res) {
    res.json({
        msg: "Get list of invitation"
    })
}

const createEvent = function(req, res) {
    res.json({
        msg: "Create event"
    })
}

const updateEvent = function(req, res) {
    res.json({
        msg: "Update event"
    })
}

const deleteEvent = function(req, res) {
    res.json({
        msg: "Delete event"
    })
}

module.exports = {
    getBasicEvent, getFullEvent, getEventInvitations,
    createEvent, updateEvent, deleteEvent
}