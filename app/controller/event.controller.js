const db = require('../models')

const getBasicEvent = async function(req, res) {
    const event = await db.Events.find({_id: req.query.id});
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
    console.log(req.body)
    db.Events.create(req.body, function(err, result) {
      if(err) {
        res.send("Failed to create")
      }
      else {
        res.send("Create successfully")
      }
    })
}

const updateEvent = async function(req, res) {
    await db.Events.findByIdAndUpdate(req.params.id, req.body, function(err, result) {
      if(err) {
        res.send("Failed to update")
      }
      else {
        res.send("Update successfully")
      }
    })
}

const deleteEvent = async function(req, res) {
    await db.Events.findByIdAndRemove(req.params.id, function(err, result) {
      if(err) {
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