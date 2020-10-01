const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followUpMeetingSchema = new Schema({
	beneficiary_id: Schema.Types.ObjectId,
	lodging_id: Schema.Types.ObjectId,
	volunteer_id: Schema.Types.ObjectId,
	contact_id: Schema.Types.ObjectId,
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
