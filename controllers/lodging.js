const express = require('express');
const router = express.Router();

const { Lodging } = require('../models');

router.post('/', (req, res) => {
	const {
		volunteer,
		address,
		firstName,
		lastName,
		age,
		phone,
		mail,
		isLodgingAvailable,
		availableFrom,
		availableTo,
		lodgingType,
		comments,
	} = req.body;

	const lodging = new Lodging({
		volunteer,
		address,
		firstName,
		lastName,
		age,
		phone,
		mail,
		isLodgingAvailable,
		availableFrom,
		availableTo,
		lodgingType,
		comments,
	});

	lodging.save((err, lodgingDb) => {
		if (err !== null) {
			res.json({
				success: false,
				message: err.toString(),
			});
			return;
		}
		res.json({
			success: true,
			data: lodginDb,
		});
	});
});

router.get('/', (req, res) => {
	Lodging.find({}, (err, lodgings) => {
		if (err !== null) {
			res.json({
				success: false,
				message: err.toString(),
			});
			return;
		}
		res.json({
			success: true,
			data: lodgings,
		});
	});
});

router.get('/:id', (req, res) => {
	const id = req.params.id;
	Lodging.findById(id, (err, lodging) => {
		if (err !== null) {
			res.json({
				success: false,
				message: err.toString(),
			});
			return;
		}
		res.json({
			success: true,
			data: lodging._id,
		});
	});
});

module.exports = router;
