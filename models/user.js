const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	email: String,
	token: String,
});

UserSchema.plugin(passportLocalMongoose, {
	usernameField: 'email',
	session: false, //no sessions in Rest API
});

//Passport-local will use this method to find a user by its email and password
UserSchema.statics.authenticateLocal = function () {
	//es5 function, to not bind this
	var _self = this;
	return function (req, email, password, cb) {
		_self.findByUsername(email, true, function (err, user) {
			if (err) {
				return cb(err);
			}
			if (user) {
				return user.authenticate(password, cb);
			} else {
				return cb(null, false);
			}
		});
	};
};

//Find a user by its token
UserSchema.statics.authenticateBearer = function () {
	var _self = this;
	return function (token, cb) {
		if (!token) {
			cb(null, false);
		} else {
			_self.findOne({ token: token }, function (err, user) {
				if (err) {
					return cb(err);
				}
				if (!user) {
					return cb(null, false);
				}
				return cb(null, user);
			});
		}
	};
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
