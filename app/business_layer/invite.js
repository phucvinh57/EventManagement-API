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

module.exports = {
    invite, responseInvitation 
}