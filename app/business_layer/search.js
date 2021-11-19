const db = require('../data_layer')

const searchEvent = async function(req, res) {
    const events = await db.Events.find({
        "name": {"$regex": req.query.name, "$option": "i"}
    })
    res.send(events);
}

module.exports = {
    searchEvent
}