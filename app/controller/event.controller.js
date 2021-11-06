const db = require('../models')
const Promise = require('bluebird')

const getBasicEvent = async function (req, res) {
    try {
        const event = await db.Events.find({ _id: req.query.id });
        res.send(event);
    } catch (e) {
        res.send(e)
    }
}

const getFullEvent = async function (req, res) {
    try {
        const eventID = req.params.id;
        const event = await db.Events.find({ _id: eventID });
        res.send(event);
    } catch (e) {
        res.send('Not found !')
    }
}

const getEventInvitations = async function (req, res) {
    try {
        const eventID = req.params.id;
        const guestIDList = await db.Invitations.find({ eventID: eventID });

        const guestDataList = await Promise.map(
            guestIDList,
            guestID => db.Users.find({ _id: guestID }),
            { concurrency: 30 }
        )
        res.send(guestDataList);
    } catch (eventErr) {
        res.send("Event does not exist");
    }


    // if (guestIDList.length === 0)
    //     return process.nextTick(() => {
    //         res.send([])
    //     })

    // const guestDataList = []
    // const taskQueue = async.queue(function (guestID, callback) {
    //     const guestData = await db.Users.find({ _id: guestID });
    //     guestDataList.push(guestData);
    // }, 10);

    res.send(guestIDList);
}

const createEvent = function (req, res) {
    console.log(req.body);
    db.Events.create(req.body, function (err, result) {
        if (err) {
            res.send("Failed to create")
        }
        else {
            res.send("Create successfully")
        }
    })
}

const updateEvent = async function (req, res) {
    await db.Events.findByIdAndUpdate(req.params.id, req.body, function (err, result) {
        if (err) {
            res.send("Failed to update")
        }
        else {
            res.send("Update successfully")
        }
    })
}

const deleteEvent = async function (req, res) {
    await db.Events.findByIdAndRemove(req.params.id, function (err, result) {
        if (err) {
            res.send("Failed to delete")
        }
        else {
            res.send("Delete successfully")
        }
    })
}

module.exports = {
    getBasicEvent, getFullEvent, getEventInvitations,
    createEvent, updateEvent, deleteEvent
}