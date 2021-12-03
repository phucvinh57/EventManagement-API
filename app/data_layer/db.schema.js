const { Schema, SchemaTypes } = require('mongoose')

const settings = [{
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
}]

const event = new Schema({
	name: SchemaTypes.String,
	startDate: SchemaTypes.Date,
	startTime: SchemaTypes.String,
	endTime: SchemaTypes.String,
	location: SchemaTypes.String,
	description: SchemaTypes.String,
	freqSetting: {
		type: {
			option: SchemaTypes.Number,
			title: SchemaTypes.String
		},
		enum: settings,
		default: settings[0]
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