const express = require('express');
const router = express.Router();

const { Contact, Address } = require('../models');

router.post('/', (req, res) => {
	console.log('contactController');
	console.log(req.body);
	const {
		address,
		firstName,
		lastName,
		organisation,
		position,
		mail,
		phone,
	} = req.body;

	const contact = new Contact({
		address,
		firstName,
		lastName,
		organisation,
		position,
		mail,
		phone,
	});
	console.log(contact);

	contact.save((err, contactDb) => {
		console.log('save');
		if (err !== null) {
			console.log(err);
			return res.json({
				success: false,
				message: err.toString(),
			});
		}
		console.log(contactDb);
		return res.json({
			success: true,
			data: contactDb,
		});
	});
});

router.get('/', (req, res) => {
	Contact.find({}, (err, contacts) => {
		if (err !== null) {
			res.json({
				success: false,
				message: err.toString(),
			});
			return;
		}
		res.json({
			success: true,
			data: contacts,
		});
	});
});

router.get('/:id', (req, res) => {
	const id = req.params.id;
	Contact.findById(id, (err, contact) => {
		if (err !== null) {
			res.json({
				success: false,
				message: err.toString(),
			});
			return;
		}
		res.json({
			success: true,
			data: contact._id,
		});
	});
});

module.exports = router;
