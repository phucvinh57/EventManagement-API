const db = require('../data_layer')

const inviteListOfUsers = async function(req, res) {
    const emailList = req.body.emailList;
    const hostID = req.body.hostID;
    const eventID = req.body.eventID;
    const role = req.body.role;
    emailList.forEach(async email => {
        const user = await db.Users.find({
            email: email
        })
        if(user) {
            await db.Invitations.create({
                hostID: hostID,
                guestID: user._id,
                eventID: eventID,
                role: role
            })
            res.send({ msg: 'Invited' });
        }
        else {
            res.send({ msg: 'User not found' });
        }
    });
}

const inviteUserByMail = async function(req, res) {
    const user = await db.Users.find({
        email: req.body.email
    })
    if(user) {
        await db.Invitations.create({
            hostID: req.body.hostID,
            guestID: user._id,
            eventID: req.body.eventID,
            role: req.body.role
        })
        res.send({ msg: 'Invited' });
    }
    else {
        res.send({ msg: 'User not found !' })
    }
}

const invite = function(req, res) {
    req.query.list !== undefined ?
        inviteListOfUsers(req, res) : inviteUserByMail(req, res);
}

const responseInvitation = async function(req, res) {
    const response = req.body.response;
    const invID = req.body.invID;
    const userID = req.body.userID;
    const eventID = req.body.eventID;
    if(response) {
        await db.Events.findByIdAndUpdate(
            eventID, 
            {$push: {"guestIDs": userID}},
            {upsert: true, new : true})
        res.send({ msg: 'Accepted' });
    }
    else {
        await db.Invitations.findByIdAndRemove(invID);
        res.send({ msg: 'Refused' });
    }
}

module.exports = {
    invite, responseInvitation 
}