const { Schema, SchemaTypes } = require('mongoose')

const eventOption = [{
	option: 0,
	title: 'Không lặp lại'
}, {
	option: 1,
	title: 'Hằng ngày'
}, {
	option: 2,
	title: 'Hằng tuần vào thứ'
}, {
	option: 3,
	title: 'Hằng tháng vào ngày'
}, {
	option: 4,
	title: 'Hằng năm vào ngày'
}, {
	option: 5,
	title: 'Tùy chỉnh'
}]

const freqType = [{
	option: 0,
	title: 'Ngày'
}, {
	option: 1,
	title: 'Tuần'
}, {
	option: 2,
	title: 'Tháng'
}, {
	option: 3,
	title: 'Năm'
}]

const endCondition = [{
	option: 0,
	title: 'Không bao giờ'
}, {
	option: 1,
	title: 'Vào ngày'
}, {
	option: 2,
	title: 'Sau n lần'
}]

const event = new Schema({
	name: SchemaTypes.String,
	startTime: SchemaTypes.Date,
  endTime: SchemaTypes.Date,
	location: SchemaTypes.String,
	description: SchemaTypes.String,
	option: {
		type: {
			option: SchemaTypes.Number,
			title: SchemaTypes.String
		},
		enum: eventOption,
		default: eventOption[0]
	},
	setting: {
		freq: SchemaTypes.Number,
		freqType: {
			type: {
				option: SchemaTypes.Number,
				title: SchemaTypes.String
			},
			enum: freqType
		}
	},
	endCondition: {
		type: {
			option: SchemaTypes.Number,
			title: SchemaTypes.String
		},
		enum: endCondition
	},
	guestIDs: [SchemaTypes.String]
});

const user = new Schema({
	username: SchemaTypes.String,
	fName: SchemaTypes.String,
	lName: SchemaTypes.String,
	password: SchemaTypes.String,
	phone: SchemaTypes.String,
	email: SchemaTypes.String,
	createdEvents: [SchemaTypes.ObjectId],
	joinedEvents: [SchemaTypes.ObjectId],
	contacts: [SchemaTypes.ObjectId],
    alowSched: [SchemaTypes.Boolean]
});

const invitation = new Schema({
	hostID: SchemaTypes.String,
	guestID: SchemaTypes.String,
	eventID: SchemaTypes.String,
	role: {
		type: SchemaTypes.String,
		enum: ['Chỉ xem', 'Chỉnh sửa']
	}
})

module.exports = {
	event,
	user,
	invitation
}