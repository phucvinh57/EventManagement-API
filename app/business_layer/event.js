const db = require('../data_layer')
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

const createEvent = async function (req, res) {
    try {
        await db.Events.create(req.body);
        res.send("Create successfully");
    } catch (err) {
        res.send("Failed to create")
    }
}

const updateEvent = async function (req, res) {
    try {
        await db.Events.findByIdAndUpdate(req.params.id, req.body);
        res.send("Update successfully")
    } catch(err) {
        res.send("Failed to update")
    }
}

const deleteEvent =  function (req, res) {
  db.Events.findByIdAndRemove(req.params.id, function(err, docs) {
    if (err){
      res.send(err);
    }
    else{
      res.send("Delete successfully");
    }
  });
  
  // try {
    //     await db.Events.findByIdAndRemove(req.params.id);
    //     res.send(msg);
    // } catch(err) {
    //     res.send("Failed to delete");
    // }
}

module.exports = {
    getBasicEvent, getFullEvent, getEventInvitations,
    createEvent, updateEvent, deleteEvent
}