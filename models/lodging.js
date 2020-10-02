const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lodgingSchema = new Schema({
	volunteer_id: { type: Schema.Types.ObjectId, ref: 'Volunteer' },
	address_id: { type: Schema.Types.ObjectId, ref: 'Address' },
	firstName: String,
	lastName: String,
	age: Number,
	phone: Number,
	mail: String,
	isLodgingAvailable: Boolean,
	availableFrom: Date,
	availableTo: Date,
	lodgingType: String,
	comments: String,
});

const Lodging = mongoose.model('Lodging', lodgingSchema);

module.exports = Lodging;
