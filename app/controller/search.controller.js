const searchUser = function(req, res) {
    res.json({
        msg: "Search user"
    })
}

const searchEvent = function(req, res) {
    res.json({
        msg: "Search event"
    })
}

module.exports = {
    searchEvent, searchUser
}