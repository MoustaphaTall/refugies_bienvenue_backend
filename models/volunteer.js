const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const volunteerSchema = new Schema({
	username: String,
	firstName: String,
	lastName: String,
	password: String,
	role: String,
	mail: String,
});

const Volunteer = mongoose.model('Volunteer', volunteerSchema);

module.exports = Volunteer;
