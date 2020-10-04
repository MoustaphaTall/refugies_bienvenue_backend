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
const {
	authController,
	beneficiaryController,
	lodgingController,
	followUpMeetingController,
	contactController,
	volunteerController,
	reportsController,
} = require('./controllers');

//Set up models
const { Volunteer } = require('./models');

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
		{ usernameField: 'mail', passReqToCallback: true, session: false },
		Volunteer.authenticateLocal() //we declared this method in the volunteer model
	)
);
passport.serializeUser(Volunteer.serializeUser()); //save user_.id to the session, encrypting password
passport.deserializeUser(Volunteer.deserializeUser()); //receive user._id from the session and fetch him from DB

//Use bearer to authenticate via a token
passport.use(new HTTPBearerStrategy(Volunteer.authenticateBearer())); //we declared this method in the User model

// Set up routes
app.use('/api', authController);
app.use('/api/beneficiaries', beneficiaryController);
app.use('/api/beneficiaries/:id/reports', reportsController);
app.use('/api/lodging', lodgingController);
app.use('/api/meetings', followUpMeetingController);
app.use('/api/contacts', contactController);
app.use('api/volunteer/', volunteerController);

//Testing if page displays correctly, delete afterwise
app.get('/', (req, res) => {
	console.log('GET /');
	res.send('It works!');
});

app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});
