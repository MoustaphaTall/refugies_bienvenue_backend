const express = require('express');
const router = express.Router();

const { Contact } = require('../models');

router.post('/', (req, res) => {
	const { address, name, role, phone, mail } = req.body;

	const contact = new Contact({
		address,
		name,
		role,
		phone,
		mail,
	});

	contact.save((err, contactDb) => {
		if (err !== null) {
			res.json({
				success: false,
				message: err.toString(),
			});
			return;
		}
		res.json({
			success: true,
			data: contactngDb,
		});
	});
});

module.exports = router;
