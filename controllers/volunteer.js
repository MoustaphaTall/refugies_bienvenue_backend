const express = require('express');
const router = express.Router();

const { Volunteer } = require('../models');

router.post('/', (req, res) => {
	const { firstName, lastName, Password, role, mail } = req.body;

	const contact = new Contact({
		firstName,
		lastName,
		Password,
		role,
		mail,
	});

	volunteer.save((err, volunteerDb) => {
		if (err !== null) {
			res.json({
				success: false,
				message: err.toString(),
			});
			return;
		}
		res.json({
			success: true,
			data: volunteerDb,
		});
	});
});

router.get('/', (req, res) => {
	Volunteer.find({}, (err, volunteers) => {
		if (err !== null) {
			res.json({
				success: false,
				message: err.toString(),
			});
			return;
		}
		res.json({
			success: true,
			data: volunteers,
		});
	});
});

router.get('/:id', (req, res) => {
	const id = req.params.id;
	Volunteer.findById(id, (err, volunteer) => {
		if (err !== null) {
			res.json({
				success: false,
				message: err.toString(),
			});
			return;
		}
		res.json({
			success: true,
			data: volunteer._id,
		});
	});
});

module.exports = router;
