const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followUpMeetingSchema = new Schema({
	beneficiary_id: { type: Schema.Types.ObjectId, ref: 'Beneficiary' },
	lodging_id: { type: Schema.Types.ObjectId, ref: 'Lodging' },
	volunteer_id: { type: Schema.Types.ObjectId, ref: 'Volunteer' },
	contact_id: { type: Schema.Types.ObjectId, ref: 'Contact' },
	interlocutor: String,
	platform: String,
	date: Date,
	attachments: String,
	isCompleted: String,
	summary: String,

	actionItems: {
		beneficiary: String,
		association: String,
	},

	jobSearchStatus: String,
	trainingStatus: String,
});

const FollowUpMeeting = mongoose.model(
	'FollowUpMeeting',
	followUpMeetingSchema
);

module.exports = FollowUpMeeting;
