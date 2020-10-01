const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activitySchema = new Schema({
	beneficiary_id: Schema.Types.ObjectId,
	nature: String,
	isFrenchTraining: Boolean,
	dateStart: Date,
	dateEnd: Date,
	comments: String,
	diploma: String,
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
