const express = require('express');
const passport = require('passport');
const uid2 = require('uid2'); //to generate random keys

const router = express.Router();

const { Volunteer } = require('../models');

router.post('/signup', (req, res) => {
	console.log('POST /signup');
	console.log('/signup req.file', req.file);
	console.log('/signup req.body', req.body);

	const { mail, role, firstName, lastName, password } = req.body;

	//User.register(user, password, callback)
	Volunteer.register(
		new Volunteer({
			mail: req.body.mail,
			firstName,
			lastName,
			role,
			token: uid2(16),
			//Create the token that will permit to authenticate the user with the http-bearer strategy
			//Use uid2 to generate a random key. Will have to be generated again if the user changes password
		}),
		password, //will be hashed
		(err, user) => {
			console.log(user);
			if (err) {
				console.log('/signup register err', err);
				res.status(400).json({ success: false, message: err.message });
			} else {
				res.json({
					success: true,
					data: {
						_id: user._id.toString(),
						token: user.token,
						firstName: user.firstName,
						lastName: user.lastName,
						role: user.role,
						mail: user.mail,
					},
				});
			}
		}
	);
});

router.post('/connection', (req, res, next) => {
	//Passport custom callback
	passport.authenticate('local', { session: false }, (err, user, info) => {
		const { token, mail, firstName, lastName } = user;
		if (err) {
			res.status(400);
			return next(err.message);
		}
		if (!user) {
			return res.status(401).json({
				success: false,
				message: 'Unauthorized',
			});
		}
		console.log('user', user);
		res.json({
			success: true,
			data: {
				_id: user._id.toString(),
				token,
				mail,
				firstName,
				lastName,
			},
		});
	})(req, res, next);
});

//To use in case we need to use a bearer token to fetch all information of the user
router.get('/benevole/:id', (req, res, next) => {
	passport.authenticate('bearer', { session: false }, (err, user, info) => {
		if (err) {
			res.status(400);
			return next(err.message);
		}
		if (!user) {
			return res.status(401).json({
				success: false,
				message: 'Unauthorized',
			});
		}

		Volunteer.findById(req.params.id)
			.then((user) => {
				if (!user) {
					res.status(404);
					return next('User not found');
				}

				return res.json({ success: true, data: user });
			})
			.catch((err) => {
				res.status(400);
				return next(err.message);
			});
	})(req, res, next);
});

//routes to test login and signup, delete afterwards
router.get('/connection', (req, res) => {
	res.send(
		'<form action="/api/connection" method="POST"><input type="text" name="firstName" placeholder="name"><input type="text" name="lastName" placeholder="lastname"><input type="text" name="mail" placeholder="mail"><input type="password" name="password" placeholder="password"><button> Add Friend </button></form>'
	);
});

router.get('/inscription', (req, res) => {
	res.send(
		'<form action="/api/inscription" method="POST"><input type="text" name="firstName" placeholder="name"><input type="text" name="lastName" placeholder="lastname"><input type="text" name="mail" placeholder="mail"><input type="password" name="password" placeholder="password"><button> Add Friend </button></form>'
	);
});

module.exports = router;
