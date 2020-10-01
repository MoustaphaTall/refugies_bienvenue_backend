const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
	address_id: { type: Schema.Types.ObjectId, ref: 'address' },
	name: String,
	function: String,
	phone: Number,
	mail: String,
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
