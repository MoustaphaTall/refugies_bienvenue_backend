const express = require('express');
const cors = require('cors'); //Enable cross-origin ressource sharing
const mongoose = require('mongoose');
const helmet = require('helmet'); //Protect from HTTP vulnerabilities
const expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession);
const passport = require('passport');
const LocalStrategy = require('passport-local');
const HTTPBearerStrategy = require('passport-http-bearer'); //To authenticate using a token

require('dotenv').config();

//Set up controllers
const { authController } = require('./controllers');

//Set up models
const { User } = require('./models');

const { PORT, MONGODB_URI } = process.env;
const port = PORT || 3002;

mongoose.connect(
	MONGODB_URI,
	{
		useCreateIndex: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
	(err) => {
		if (err !== null) {
			console.log('Error connecting to DB', err);
			return;
		}
		console.log('DB successfully connected');
	}
);

const app = express();
//Enable cross-origin ressource sharing
app.use(cors());
//Protect from HTTP vulnerabilities
app.use(helmet());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Enable passport
app.use(passport.initialize());

//Configure passport
//Get user who wants to authenticate()
passport.use(
	new LocalStrategy(
		{ usernameField: 'email', passReqToCallback: true, session: false },
		User.authenticateLocal() //we declared this method in the User model
	)
);
passport.serializeUser(User.serializeUser()); //save user_.id to the session, encrypting password
passport.deserializeUser(User.deserializeUser()); //receive user._id from the session and fetch him from DB

//Use bearer to authenticate via a token
passport.use(new HTTPBearerStrategy(User.authenticateBearer())); //we declared this method in the User model

// Set up routes
app.use('/api', authController);

//Testing if page displays correctly, delete afterwise
app.get('/', (req, res) => {
	console.log('GET /');
	res.send('It works!');
});

app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});
