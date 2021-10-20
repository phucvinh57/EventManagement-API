const getBasicEvent = function(req, res) {
    res.json({
        msg: "Get basic event info"
    })
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