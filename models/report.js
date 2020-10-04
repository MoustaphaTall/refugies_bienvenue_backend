const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema({
	beneficiary: { type: Schema.Types.ObjectId, ref: 'Beneficiary' },
	arrivalFrenchLevel: String,
	exitFrenchLevel: String,
	perceivedAmeliorationFrenchLevel: Boolean,
	commentsFrenchLevel: String,
	confidenceGain: String,
	isAssociationUseful: Boolean,
	commentsAssociation: String,
	personalFeedback: String,
	associationFeedback: String,
	journeyFeedback: String,
	peopleMetFeedback: String,
	takenSteps: String,
	goals: String,
	created: Date,
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
