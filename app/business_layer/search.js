const db = require('../data_layer')

const searchEvent = async function(req, res) {
    try {
      const user = await db.Users.findById(req.userId);
      const events = await db.Events.find({
          _id: {
              $in: user.createdEvents.concat(user.joinedEvents)
          }, name: {
            $regex: req.body.name, $options: 'i'
          }
      }).sort({startDate: 1})
      const basicEvents = events.map(event => {
          let basicEvent = {}
          basicEvent['_id'] = event._id
          basicEvent['name'] = event.name
          basicEvent['startDay'] = event.startDate.toISOString().slice(0, 10)
          basicEvent['startTime'] = event.startTime
          return basicEvent
      }
      );
      res.status(200).send(basicEvents);
  } catch (err) {
      res.status(501).send({ msg: 'Server error' });
  }
}

module.exports = {
    searchEvent
}