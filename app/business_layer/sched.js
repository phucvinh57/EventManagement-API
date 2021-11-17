const ObjectId = require('mongoose').Types.ObjectId
const db = require('../data_layer')

const getSchedule = async function (req, res) {
    const eventId = req.params.id
    // const start = {
    //     date: req.query.startDate,
    //     time: req.query.startTime
    // }
    // const end = {
    //     date: req.query.endDate,
    //     time: req.query.endTime
    // }
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

module.exports = { getSchedule }