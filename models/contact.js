const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
	address: { type: Schema.Types.ObjectId, ref: 'address' },
	firstName: String,
	lastName: String,
	organization: String,
	position: String,
	phone: Number,
	mail: String,
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
