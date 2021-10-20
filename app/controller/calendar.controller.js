const getMonth = function(req, res) {
    res.json({
        msg: "Get Month"
    })
}

const getDay = function(req, res) {
    res.json({
        msg: "Get Day"
    })
}

const getCalendar = function(req, res) {
    req.query.day === undefined ?
        getMonth(req, res) : getDay(req, res);
}

module.exports = {
    getCalendar
}