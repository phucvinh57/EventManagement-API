// Lấy dữ liệu cho 1 tháng
const getMonth = function(req, res) {
    res.json({
        msg: "Get Month"
    })
}

// Lấy dữ liệu
const getDay = function(req, res) {
    res.json({
        msg: "Get Day"
    })
}

// No need to change
const getCalendar = function(req, res) {
    // Factory Pattern
    req.query.day === undefined ?
        getMonth(req, res) : getDay(req, res);
}

module.exports = {
    getCalendar
}