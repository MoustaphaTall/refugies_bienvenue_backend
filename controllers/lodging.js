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
			// console.log('err', err);
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
		// console.log('lodging', lodgingDb);
	});
});

router.get('/', (req, res) => {
	Lodging.find({}, (err, lodgings) => {
		if (err !== null) {
			// console.log('err', err);
			res.json({
				success: false,
				message: err.toString(),
			});
			return;
		}
		// console.log(lodgings);
		res.json({
			success: true,
			data: lodgings,
		});
		// console.log('lodgings', lodgings);
	});
});

router.get('/:id', (req, res) => {
	const id = req.params.id;
	Lodging.findById(id, (err, lodging) => {
		if (err !== null) {
			// console.log('err', err);
			res.json({
				success: false,
				message: err.toString(),
			});
			return;
		}
		// console.log(lodging);
		res.json({
			success: true,
			data: lodging.id,
		});
	});
});

module.exports = router;
