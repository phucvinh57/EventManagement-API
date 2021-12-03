const db = require('../data_layer')
// const fs = require('fs')

//Support function
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
function zeroPrefix(num) {
    return parseInt(num) < 10 ? '0'.concat(num) : num
}

// Lấy dữ liệu cho 1 tháng
const getMonth = async function (req, res) {
    const input = {
        month: zeroPrefix(req.query.month),
        year: req.query.year
    }

    const d1 = new Date(`${input.year}-${input.month}-01T00:00:00.000Z`);
    const d2 = addMonths(d1, 1)
    try {
        const events = await db.Events.find({
            $or: [
                {
                    startDate: {
                        $gte: d1.toISOString(),
                        $lte: d2.toISOString()
                    },
                    'freqSetting.option': 0
                },
                {
                    'freqSetting.option': { $in: [1, 2, 3, 4] }, // Hàng ngày, hàng tuần, hàng tháng
                    startDate: {
                        $lte: d2.toISOString() //Ngay cuoi thang
                    }
                }
            ]
        })
        // fs.writeFileSync('dataSample.json', JSON.stringify(events))
        res.status(200).send(events)
    } catch (err) {
        res.status(500).send(err)
    }
}

// Lấy dữ liệu
const getDay = async function (req, res) {
    const input = {
        day: zeroPrefix(req.query.day),
        month: zeroPrefix(req.query.month),
        year: req.query.year
    }

    // Tính tháng thời điểm hiện tại
    const d1 = new Date(`${input.year}-${input.month}-${input.day}T00:00:00.000Z`);
    const d2 = addDates(d1, 1)

    try {
        const events = await db.Events.find({
            $or: [
                {
                    startDate: {
                        $gte: d1.toISOString(),
                        $lte: d2.toISOString()
                    },
                    option: 0
                },
                {
                    option: { $in: [1, 2, 3] },
                    endDate: {
                        $lte: d2.toISOString() //Ngay cuoi thang
                    }
                },
                {
                    option: 4,
                    startDate: d2.getDate()
                }
            ]
        })
        res.status(200).send(events)
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