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
      option: SchemaTypes.Number,
      title: SchemaTypes.String
		}
	},
	endCondition: {
    option: SchemaTypes.Number,
    title: SchemaTypes.String,
    condition: SchemaTypes.String
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
	allowSched: SchemaTypes.Boolean,
	createdEvents: [SchemaTypes.ObjectId],
	joinedEvents: [SchemaTypes.ObjectId],
	contacts: [SchemaTypes.ObjectId],
});

const invitation = new Schema({
	hostId: SchemaTypes.ObjectId,
	guestId: SchemaTypes.ObjectId,
	eventId: SchemaTypes.ObjectId,
	role: SchemaTypes.Boolean, // 0: Chỉ xem, 1: Chỉnh sửa
  status: SchemaTypes.String,
  responsed: SchemaTypes.Boolean,
  inviteTime: SchemaTypes.Date
})

module.exports = {
	event, user,
	invitation
}