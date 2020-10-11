const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followUpMeetingSchema = new Schema({
	beneficiary: { type: Schema.Types.ObjectId, ref: 'Beneficiary' },
	lodging: { type: Schema.Types.ObjectId, ref: 'Lodging' },
	volunteer: { type: Schema.Types.ObjectId, ref: 'Volunteer' },
	contact: { type: Schema.Types.ObjectId, ref: 'Contact' },
	mailVolunteer: String,
	nameVolunteer: String,
	interlocutor: String,
	nameInterlocutor: String,
	mailInterlocutor: String,
	phoneInterlocutor: Number,
	platform: String,
	date: Date,
	attachments: String,
	isCompleted: Boolean,
	summary: String,
	actionItemsBeneficiary: String,
	actionItemsAssociation: String,
	jobSearchStatus: String,
	trainingStatus: String,
});

const FollowUpMeeting = mongoose.model(
	'FollowUpMeeting',
	followUpMeetingSchema
);

module.exports = FollowUpMeeting;
