const getPersonalInfo = function(req, res) {
    res.json({
        msg: "Get personal info"
    })
}
const changePassword = function(req, res) {
    res.json({
        msg: "Get personal info"
    })
}
const updateInfo = function(req, res) {
    res.json({
        msg: "Get personal info"
    })
}
const getUserInfoById = function(req, res) {
    res.json({
        msg: "Get user info by id"
    })
}
const deleteAccount = function(req, res) {
    res.json({
        msg: "Delete account"
    })
}

module.exports = {
    getPersonalInfo,
    changePassword,
    updateInfo,
    getUserInfoById,
    deleteAccount
}