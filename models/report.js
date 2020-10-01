const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema({
	beneficiary_id: Schema.Types.ObjectId,

	frenchLevel: {
		arrivalAssociation: String,
		exitAssociation: String,
		perceivedAmelioration: Boolean,
		comments: String,
	},

	confidenceGain: String,

	association: {
		isUseful: Boolean,
		comments: String,
	},

	feedback: {
		personal: String,
		association: String,
		journey: String,
		peopleMet: String,
	},

	takenSteps: String,
	goals: String,
	created: Date,
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
