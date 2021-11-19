const db = require('../data_layer')
const ObjectId = require('mongoose').Types.ObjectId
const Promise = require('bluebird')

const getBasicEvent = async function (req, res) {
    const event = await db.Events.findById(req.query.id).exec();
    let data = event ? event : { msg: 'Event not found !' };
    res.send(data);
}

const getFullEvent = async function (req, res) {
    const eventID = req.params.id;
    const event = await db.Events.findById(eventID).exec();
    let data = event ? event : { msg: 'Event not found !' }
    res.send(data);
}

const getEventInvitations = async function (req, res) {
    // First lookup eventID in collection 'Invitations'. Return array of guestID
    const eventID = req.params.id;
    const guestIDList = await db.Invitations.find({ eventId: eventID }, 'guestID').exec();

    // Retrieve data of guest list by id in parallel, with maximun concurency is 30
    // to avoid server overhead
    if (guestIDList.length > 0){
        const guestDataList = await Promise.map(
            guestIDList,
            guestID => db.Users.find({ _id: guestID }),
            { concurrency: 30 }
        )
        res.send(guestDataList);
    }
    else {
        process.nextTick(() => {
            res.send({ msg: 'Event not found !' })
        })
    }
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
    // Khi sử dụng await không có callback
    await db.Events.findByIdAndRemove(req.params.id, function (err, result) {
        if (err) {
            res.send("Failed to delete")
        }
        else {
            res.send("Delete successfully")
        }
    })
}

const inviteListOfUsers = function(req, res) {
    res.json({
        msg: "Invite all users in given list"
    })
}
const inviteUserById = function(req, res) {
    res.json({
        msg: "Invite user who owns given id"
    })
}
const invite = function(req, res) {
    req.query.list !== undefined ?
        inviteListOfUsers(req, res) : inviteUserById(req, res);
}

const responseInvitation = function(req, res) {
    res.json({
        msg: "Response the invitation"
    })
}
const getSchedule = async function (req, res) {
    const eventId = req.params.id
    try {
        const result = await db.Invitations.aggregate([
            { $match: { eventId: ObjectId(eventId) } },
            {
                $group: {
                    '_id': '$eventId',
                    'guests': {
                        $push: {
                            guestId: '$guestId',
                            role: '$role'
                        }
                    }
                }
            },
            {}
        ]);
        res.status(200).send(result)
    } catch (err) {
        console.log(err)
        res.status(500).send({msg: "Error"});
    }
}

module.exports = {
    getBasicEvent, getFullEvent, getEventInvitations,
    createEvent, updateEvent, deleteEvent,
    invite, responseInvitation,
    getSchedule
}