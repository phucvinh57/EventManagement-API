const db = require('../models')
const async = require('async')

const getBasicEvent = async function (req, res) {
    const event = await db.Event.find({ _id: req.query.id });
    res.send(event);
}

const getFullEvent = async function (req, res) {
    const eventID = req.params.id;
    const event = await db.Event.find({ _id: eventID });
    res.send(event);
}

const getEventInvitations = async function (req, res) {
    const eventID = req.params.id;
    const guestIDList = await db.Invitations.find({ eventID: eventID });

    if (guestIDList.length === 0)
        return process.nextTick(() => {
            res.send([])
        })

    const guestDataList = []
    const taskQueue = async.queue(function (guestID, callback) {
        const guestData = await db.Users.find({ _id: guestID });
        guestDataList.push(guestData);
    }, 10);

    res.send(guestList);
}

const createEvent = function (req, res) {
    res.json({
        msg: "Create event"
    })
}

const updateEvent = function (req, res) {
    res.json({
        msg: "Update event"
    })
}

const deleteEvent = function (req, res) {
    res.json({
        msg: "Delete event"
    })
}

module.exports = {
    getBasicEvent, getFullEvent, getEventInvitations,
    createEvent, updateEvent, deleteEvent
}