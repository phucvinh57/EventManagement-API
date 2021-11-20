const db = require('../data_layer')
const ObjectId = require('mongoose').Types.ObjectId
const Promise = require('bluebird')

const getBasicEvent = async function (req, res) {
    try {
        const event = await db.Events.findById(req.params.id).exec();
        let data = event ? event : { msg: 'Event not found !' };
        res.status(200).send(data);
    } catch (err) {
        res.status(500).send({ msg: 'Server error' });
    }
}

const getAllBasicEvent = async function (req, res) {
    try {
        const user = await db.Users.findById(req.userId);
        const events = await db.Events.find({
            _id: {
                $in: user.createdEvents
            }
        })
        const basicEvents = events.map(event => {
            let basicEvent = {}
            basicEvent['_id'] = event._id
            basicEvent['name'] = event.name
            basicEvent['startDay'] = event.startTime.toISOString().slice(0, 10)
            basicEvent['startTime'] = event.startTime.toISOString().slice(11, 16)
            return basicEvent
        }
        );
        res.status(200).send(basicEvents);
    } catch (err) {
        res.status(500).send({ msg: 'Server error' });
    }
}

const getFullEvent = async function (req, res) {
    try {
        const eventID = req.params.id;
        const event = await db.Events.findById(eventID).exec();
        let data = event ? event : { msg: 'Event not found !' }
        let resEvent = {
            name: data.name,
            startDay: data.startTime.toISOString().slice(0, 10),
            startTime: data.startTime.toISOString().slice(11, 16),
            endTime: data.endTime.toISOString().slice(11, 16),
            location: data.location,
            description: data.description,
            option: data.option,
            guestIDs: data.guestIDs,
            setting: data.setting,
            endCondition: data.endCondition
        }
        res.status(200).send(resEvent);
    } catch (err) {
        res.status(500).send({ msg: 'Server error' });
    }
}

const getEventInvitations = async function (req, res) {
    // First lookup eventID in collection 'Invitations'. Return array of guestID
    const eventID = req.params.id;
    const guestIDList = await db.Invitations.find({ eventId: eventID }, 'guestID').exec();

    // Retrieve data of guest list by id in parallel, with maximun concurency is 30
    // to avoid server overhead
    if (guestIDList.length > 0) {
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

const createEvent = async function (req, res) {
    const event = req.body;
    const name = event.name;
    const startTime = new Date(`${event.startDay}T${event.startTime}:00.000Z`);
    const endTime = new Date(`${event.startDay}T${event.endTime}:00.000Z`);
    const location = event.location;
    const description = event.description;
    const option = event.option;
    const guestIDs = event.guestIDs;
    try {
        const eventCreated = await db.Events.create({
            name: name,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            location: location,
            description: description,
            option: option,
            guestIDs: guestIDs
        });
        await db.Users.findByIdAndUpdate(
            '61952c497d33e6c7c825f51e',
            { $push: { "createdEvents": eventCreated._id } },
            { upsert: true, new: true }
        );
        res.send({
            ok: true,
            event: eventCreated,
            message: 'Event created'
        });
    } catch (err) {
        res.send("Failed to create");
    }
}

const updateEvent = async function (req, res) {
    const event = req.body;
    const name = event.name;
    const startTime = new Date(`${event.startDay}T${event.startTime}:00.000Z`);
    const endTime = new Date(`${event.startDay}T${event.endTime}:00.000Z`);
    const location = event.location;
    const description = event.description;
    const option = event.option;
    const guestIDs = event.guestIDs;
    try {
        const eventUpdated = await db.Events.findByIdAndUpdate(req.params.id, {
            name: name,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            location: location,
            description: description,
            option: option,
            guestIDs: guestIDs
        });
        res.send({
            ok: true,
            event: eventUpdated,
            message: 'Event updated'
        });
    } catch (err) {
        res.send("Failed to update")
    }
}

const deleteEvent = function (req, res) {
    db.Events.findByIdAndRemove(req.params.id, function (err, docs) {
        if (err) {
            res.status(501).send({ msg: 'Failed to delete' });
        }
        else {
            res.send("Delete successfully");
        }
    });
}

const inviteListOfUsers = async function (req, res) {
    const emailList = req.body.list;
    const mailExist = [];
    const mailNotFound = [];
    const mailOk = [];
    try {
        emailList.forEach(async email => {
            const user = await db.Users.findOne({
                email: email
            })
            if (user) {
                const exist = await db.Invitations.find({
                    guestId: user._id,
                    eventId: req.body.eventID
                });
                if (exist) {
                    mailExist.push(email);
                }
                else {
                    await db.Invitations.create({
                        hostId: req.body.hostID,
                        guestId: user._id,
                        eventId: req.body.eventID,
                        role: req.body.role
                    })
                    mailOk.push(email);
                }
            }
            else {
                mailNotFound.push(email);
            }
        });
        res.status(200).send({
            msg: 'Invited',
            mailExist: mailExist,
            mailNotFound: mailNotFound,
            mailOk: mailOk
        })
    } catch (err) {
        res.status(501).send({ msg: 'Server error!' })
    }
}

const inviteUserByMail = async function (req, res) {
    const user = await db.Users.findOne({
        email: req.body.email
    });
    if (user) {
        const exist = await db.Invitations.find({
            guestId: user._id,
            eventId: req.body.eventID
        });
        if (exist) {
            res.send({ msg: 'User already invited!' });
            return;
        }
        try {
            await db.Invitations.create({
                hostId: req.body.hostID,
                guestId: user._id,
                eventId: req.body.eventID,
                role: req.body.role
            })
            res.status(200).send({ msg: 'Invited', user });
        } catch (err) {
            res.status(501).send({ msg: 'Server error!' })
        }
    }
    else {
        res.send({ msg: 'User not found !' })
    }
}

const invite = function (req, res) {
    req.body.list !== undefined ?
        inviteListOfUsers(req, res) : inviteUserByMail(req, res);
}

const responseInvitation = async function (req, res) {
    const response = req.body.response;
    const invID = req.body.invID;
    const userID = req.body.userID;
    const eventID = req.body.eventID;
    if (response) {
        await db.Events.findByIdAndUpdate(
            eventID,
            { $push: { "guestIDs": userID } },
            { upsert: true, new: true })
        res.send({ msg: 'Accepted' });
    }
    else {
        await db.Invitations.findByIdAndRemove(invID);
        res.send({ msg: 'Refused' });
    }
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
        res.status(500).send({ msg: "Error" });
    }
}

module.exports = {
    getBasicEvent, getFullEvent, getEventInvitations,
    getAllBasicEvent,
    createEvent, updateEvent, deleteEvent,
    invite, responseInvitation,
    getSchedule
}