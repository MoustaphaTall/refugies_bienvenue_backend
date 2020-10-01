const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
	address_id: Schema.Types.ObjectId,
	name: String,
	function: String,
	phone: Number,
	mail: String,
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
