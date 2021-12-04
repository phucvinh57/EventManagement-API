const db = require('../data_layer')
const fs = require('fs')

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

String.prototype.replaceAt = function(index, replacement) {
  return this.substr(0, index) + replacement + this.substr(index + replacement.length);
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
		const user = await db.Users.findById(req.userId);

		const events = await db.Events.aggregate([
			{
				$project: {
					_id: true,
					name: true,
					startTime: true,
					endTime: true,
					location: true,
					startDate: true,
					freqSetting: true,
          description: true,
					month: { $month: '$startDate' }
				}
			},
			{
				$match: {
					$and: [
						{
							_id: {
								$in: user.createdEvents.concat(user.joinedEvents)
							}
						},
						{
							$or: [
								{
									startDate: {
										$gte: d1,
										$lte: d2
									},
									'freqSetting.option': 0
								},
								{
									'freqSetting.option': { $in: [1, 2, 3] }, // Hàng ngày, hàng tuần, hàng tháng
									startDate: {
										$lte: d2 //Ngay cuoi thang
									}
								},
								{
									'freqSetting.option': 4, // Hàng năm
									startDate: {
										$lte: d2 //Ngay cuoi thang
									},
									month: d1.getMonth() + 1
								}
							]
						}
					],
				}
			},
			{
				$project: {
					month: 0
				}
			}
		])
    const resEvents = events.map(event => {
      let ev = {}
      ev['_id'] = event._id
      ev['startTime'] = event.startDate.toISOString().replaceAt(11, event.startTime)
      ev['endTime'] = event.startDate.toISOString().replaceAt(11, event.endTime)
      ev['location'] = event.location
      ev['name'] = event.name
      ev['description'] = event.description
      ev['freqSetting'] = event.freqSetting
      return ev
    })
		fs.writeFileSync('dataSample.json', JSON.stringify(resEvents))
		res.status(200).send(resEvents)
	} catch (err) {
		console.log(err)
		res.status(500).send({ msg: 'INTERNAL SERVER ERROR' })
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
		const user = await db.Users.findById(req.userId);
		const events = await db.Events.aggregate([
			{
				$project: {
					_id: true,
					name: true,
					startTime: true,
					endTime: true,
					location: true,
					startDate: true,
					freqSetting: true,
          description: true,
					day: { $dayOfMonth: '$startDate' },
					dayOfWeek: { $dayOfWeek: '$startDate' },
					month: { $month: '$startDate' }
				}
			},
			{
				$match: {
					$and: [
						{
							_id: {
								$in: user.createdEvents.concat(user.joinedEvents)
							}
						},
						{
							$or: [
								{

									'freqSetting.option': 0,
									startDate: {
										$gte: d1,
										$lte: d2
									}
								},
								{
									'freqSetting.option': 1, // Hàng ngày
									startDate: {
										$lte: d2 // Cuối ngày
									}
								},
								{
									'freqSetting.option': 2, // Hàng tuần
									startDate: {
										$lte: d2 // Cuối ngày
									},
									dayOfWeek: d1.getDay() + 1
								},
								{
									'freqSetting.option': 3, // Hàng tháng
									startDate: {
										$lte: d2 // Cuối ngày
									},
									day: d1.getDate()
								},
								{
									'freqSetting.option': 4, // Hàng năm
									startDate: {
										$lte: d2 // Cuối ngày
									},
									day: d1.getDate(),
									month: d1.getMonth() + 1
								}
							]
						}
					],
				}
			},
			{
				$project: {
					day: 0,
					dayOfWeek: 0,
					month: 0
				}
			}
		])
    const resEvents = events.map(event => {
      let ev = {}
      ev['_id'] = event._id
      ev['startTime'] = event.startDate.toISOString().replaceAt(11, event.startTime)
      ev['endTime'] = event.startDate.toISOString().replaceAt(11, event.endTime)
      ev['location'] = event.location
      ev['name'] = event.name
      ev['description'] = event.description
      ev['freqSetting'] = event.freqSetting
      return ev
    })
		fs.writeFileSync('dataSample.json', JSON.stringify(resEvents))
		res.status(200).send(resEvents)
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