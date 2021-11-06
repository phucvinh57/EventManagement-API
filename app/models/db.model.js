const { Schema } = require('mongoose')

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

const eventSchema = new Schema({
	name: String,
	startTime: Date,
	location: String,
	description: String,
	option: {
		type: {
			option: Number,
			title: String
		},
		enum: eventOption,
		default: eventOption[0]
	},
	setting: {
		freq: Number,
		freqType: {
			type: {
				option: Number,
				title: String
			},
			enum: freqType
		}
	},
	endCondition: {
		type: {
			option: Number,
			title: String
		},
		enum: endCondition
	},
	guestIDs: [String]
});

const userSchema = new Schema({
	accountName: String,
	fName: String,
	lName: String,
	password: String,
	phone: String,
	email: String,
	createdEvents: [String],
	joinedEvents: [String]
});

const invitationSchema = new Schema({
	hostID: String,
	guestID: String,
	eventID: String,
	role: {
		type: String,
		enum: ['Chỉ xem', 'Chỉnh sửa']
	}
})

module.exports = {
	eventSchema,
	userSchema,
	invitationSchema
}