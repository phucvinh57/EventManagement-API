const db = require('../data_layer')

function addMonths(date, numOfMonths) {
    let copyDate = new Date(date.getTime())
    let d = copyDate.getDate();
    copyDate.setMonth(copyDate.getMonth() + +numOfMonths);
    if (copyDate.getDate() != d) {
        copyDate.setDate(0);
    }
    return copyDate;
}

function addDates(date, numOfDates) {
    return new Date(date.getTime() + 1000 * 60 * 60 * 24 * numOfDates)
}

// Lấy dữ liệu cho 1 tháng
const getMonth = async function (req, res) {
    const input = {
        month: req.query.month,
        year: req.query.year
    }
    console.log(input)

    const d1 = new Date(`${input.year}-${input.month}-01T00:00:00.000Z`);
    const d2 = addMonths(d1, 1)
    try {
        const events = await db.Events.find({
            startTime: {
                $gte: d1.toISOString(),
                $lte: d2.toISOString()
            }
        })
        res.status(500).send(events)
    } catch (err) {
        res.status(500).send(err)
    }
}

// Lấy dữ liệu
const getDay = async function (req, res) {
    const input = {
        day: req.query.day,
        month: req.query.month,
        year: req.query.year
    }

    const d1 = new Date(`${input.year}-${input.month}-${input.day}T00:00:00.000Z`);
    const d2 = addDates(d1, 1)
    try {
        const events = await db.Events.find({
            startTime: {
                $gte: d1.toISOString(),
                $lte: d2.toISOString()
            }
        })
        res.status(500).send(events)
    } catch (err) {
        res.status(500).send(err)
    }
}

// No need to change
const getCalendar = function (req, res) {
    // Factory Pattern
    req.query.day === undefined ?
        getMonth(req, res) : getDay(req, res);
}

module.exports = {
    getCalendar
}