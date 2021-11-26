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
                $in: user.createdEvents.concat(user.joinedEvents)
            }
        }).sort({startTime: 1})
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
            req.userId,
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

const deleteEvent = async function (req, res) {
    try {
      await db.Users.findByIdAndUpdate(
        req.userId,
        { $pull: { 'createdEvents': new ObjectId(req.params.id) } },
        { new: true }
      );
      await db.Invitations.deleteMany({eventId: req.params.id});
      await db.Events.findByIdAndRemove(req.params.id);
      res.status(200).send("Delete successfully");
    } catch(err) {
      res.status(501).send({ msg: 'Failed to delete' });
    }
}


const getEventInvitations = async function (req, res) {
  // First lookup eventID in collection 'Invitations'. Return array of guestID
  try {
    const eventID = req.params.id;
    const invitations = await db.Invitations.find({ eventId: eventID });
    // Retrieve data of guest list by id in parallel, with maximun concurency is 30
    // to avoid server overhead
    if (invitations.length > 0) {
        const userIds = invitations.map(invitation => invitation.guestId)
        const users = await db.Users.find({
          _id: {
              $in: userIds
          }
        })
        let i = 0;
        const guestDataList = invitations.map(invitation => {
          let guestData = {}
          guestData['inv_id'] = invitation._id
          guestData['fName'] = users[i].fName
          guestData['lName'] = users[i].lName
          guestData['status'] = invitation.status
          guestData['role'] = invitation.role
          guestData['mem_id'] = users[i]._id
          guestData['ev_id'] = invitation.eventId
          i = i+1;
          return guestData
        })
        res.send(guestDataList)
    }
    else {
        res.send([]);
    }
  } catch(err) {
    res.status(501).send({msg: 'Server error!'});
  }
}

const getEventNotifications = async function (req, res) {
  try {
    const invitations = await db.Invitations.find({ guestId: req.userId });
    if (invitations.length > 0) {
        const eventIds = invitations.map(invitation => invitation.eventId)
        const events = await db.Events.find({
          _id: {
              $in: eventIds
          }
        })
        const hostIds = invitations.map(invitation => invitation.hostId)
        const hosts = await Promise.map(hostIds, hostId => db.Users.findOne({_id: hostId}))
        const notifications = invitations.map((invitation, i) => {
          let notification = {}
          notification['_id'] = invitation._id
          notification['fName'] = hosts[i].fName
          notification['lName'] = hosts[i].lName
          notification['eventName'] = events[i].name
          notification['startDay'] = events[i].startTime.toISOString().slice(0, 10)
          notification['startTime'] = events[i].startTime.toISOString().slice(11, 16)
          notification['responsed'] = invitation.responsed
          return notification
        })
        res.send(notifications)
    }
    else {
        res.send([]);
    }
  } catch(err) {
    res.status(501).send({msg: 'Server error!'});
  }
}

const inviteListOfUsers = async function (req, res) {
    const emailList = req.body.list
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
                if (exist.length === 0) {
                    await db.Invitations.create({
                        hostId: req.userId,
                        guestId: user._id,
                        eventId: req.body.eventID,
                        role: req.body.role,
                        status: 'Đã mời', 
                        responsed: 0
                    })
                }
            }
        });
        res.status(200).send({
            msg: 'Invited'
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
      const isHost = user.createdEvents.filter(eventId => eventId.toString() === req.body.eventID)
      if(isHost.length !== 0) {
        res.send({ msg: 'Cannot invite host!' });
        return;
      }
      if(user._id.toString() !== req.userId) {
        const exist = await db.Invitations.findOne({
            guestId: user._id,
            eventId: req.body.eventID
        });
        if (exist) {
            res.send({ msg: 'User already invited!' });
            return;
        }
        try {
            const today = new Date()
            const invitation = await db.Invitations.create({
                hostId: req.userId,
                guestId: user._id,
                eventId: req.body.eventID,
                role: req.body.role,
                status: 'Đã mời', 
                responsed: 0
                // inviteTime: new Date(`${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}T${today.getHours()}:${today.getMinutes()}:${("0" + today.getSeconds()).slice(-2)}.000Z`)
            })
            res.status(200).send({ 
              msg: 'Invited', 
              member: [{
                inv_id: invitation._id,
                fName: user.fName,
                lName: user.lName,
                status: invitation.status,
                role: invitation.role,
                mem_id: user._id,
                ev_id: invitation.eventId
              }] });
        } catch (err) {
            res.status(501).send({ msg: 'Server error!' })
        }
      }
      else res.status(200).send({ msg: 'You cannot invite yourself' })
    }
    else {
        res.send({ msg: 'User not found !' })
    }
}

const invite = function (req, res) {
    req.body.list !== undefined ?
        inviteListOfUsers(req, res) : inviteUserByMail(req, res);
}

const cancelInvitation = async function (req, res) {
  try {
    await db.Users.findByIdAndUpdate(
      req.body.mem_id,
      { $pull: { 'joinedEvents': req.body.ev_id} },
      { new: true }
    );
    await db.Invitations.findByIdAndRemove(req.params.id);
    res.status(200).send("Delete successfully");
  } catch(err) {
    res.status(501).send({ msg: 'Failed to delete' });
  }
}

const changeRole = async function (req, res) {
  try {
    await db.Invitations.findByIdAndUpdate(
      req.params.id,
      {
        role: req.body.role
      }
    );
    res.status(200).send({msg: "Changed"});
  } catch(err) {
    res.status(500).send({ msg: 'Failed to change' });
  }
}

const getRole = async function (req, res) {
  const eventID = req.params.id
  try {
    const invitation = await db.Invitations.findOne(
      { 
        eventId: eventID,
        guestId: req.userId
      }
    );
    const user = await db.Users.findOne(
      { 
        _id: req.userId
      }
    );

    const isHost = user.createdEvents.filter(eventId => eventId.toString() === eventID)

    if(isHost.length !== 0) {
      res.status(200).send({msg: "Edit", status: true});
    }
    else if(invitation) {
      if(invitation.role) res.status(200).send({msg: "Edit", status: true});
      else res.status(200).send({msg: "View", status: false});
    }
    else res.status(200).send({msg: "View", status: false});
  } catch(err) {
    res.status(500).send({ msg: 'Server error' });
  }
}

const responseInvitation = async function (req, res) {
    const response = req.body.res;
    const invID = req.params.id;
    const userID = req.userId;
    // const eventID = req.body.eventID;
    if (response === 'Đồng ý') {
      const invitation = await db.Invitations.findOne({_id: invID});
      await db.Invitations.findByIdAndUpdate(invID, {
        status: 'Đã đồng ý', 
        responsed: 1
      })
      await db.Users.findByIdAndUpdate(
        userID,
        { $push: { "joinedEvents":  invitation.eventId} },
        { upsert: true, new: true }
    );
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
    invite, responseInvitation, cancelInvitation,
    getSchedule, getEventNotifications, 
    changeRole, getRole
}