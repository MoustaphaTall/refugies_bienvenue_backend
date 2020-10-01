const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
	streetNumber: Number,
	streetName: String,
	zipCode: Number,
	city: String,
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
