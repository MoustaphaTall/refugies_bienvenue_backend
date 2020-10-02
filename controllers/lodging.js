const express = require('express');
const router = express.Router();

const { Lodging } = require('../models');

router.post('/', (req, res) => {
	console.log('#lodging');
	console.log('req.body lodging.js', req.body);

	const volunteer = req.body.volunteer;
	const address = req.body.address;
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const age = req.body.age;
	const phone = req.body.phone;
	const mail = req.body.mail;
	const isLodgingAvailable = req.body.isLodgingAvailable;
	const availableFrom = req.body.availableFrom;
	const availableTo = req.body.availableTo;
	const lodgingType = req.body.lodgingType;
	const comments = req.body.comments;

	const lodging = new Lodging({
		// volunteer: volunteer,
		// address: address,
		firstName: firstName,
		lastName: lastName,
		age: age,
		phone: phone,
		mail: mail,
		isLodgingAvailable: isLodgingAvailable,
		availableFrom: availableFrom,
		availableTo: availableTo,
		lodgingType: lodgingType,
		comments: comments,
	});

	lodging.save((err, lodgingDb) => {
		if (err !== null) {
			console.log('err', err);
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
		console.log('lodging', lodgingDb);
	});
});

router.get('/', (req, res) => {
	Lodging.find({}, (err, lodgings) => {
		if (err !== null) {
			console.log('err', err);
			res.json({
				success: false,
				message: err.toString(),
			});
			return;
		}
		console.log(lodgings);
		res.json({
			success: true,
			data: lodgings,
		});
		console.log('lodgings', lodgings);
	});
});

router.get('/:id', (req, res) => {
	const id = req.params.id;
	Lodging.findById(id, (err, lodging) => {
		if (err !== null) {
			console.log('err', err);
			res.json({
				success: false,
				message: err.toString(),
			});
			return;
		}
		console.log(lodging);
		res.json({
			success: true,
			data: lodging.id,
		});
	});
});

module.exports = router;
