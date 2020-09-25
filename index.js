const express = require('express');
const mongoose = require('mongoose');
const expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession);
const passport = require('passport');
const LocalStrategy = require('passport-local');

require('dotenv').config();

//Set up controllers
const { authController } = require('./controllers');

//Set up models
const { User } = require('./models');

const { PORT, MONGODB_URI } = process.env;
const port = PORT || 3000;

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
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Enable session management
app.use(
	expressSession({
		secret: 'finalrefubienv56',
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({ mongooseConnection: mongoose.connection }),
	})
);

//Enable passport
app.use(passport.initialize());
app.use(passport.session());

//Configure passport
passport.use(new LocalStrategy(User.authenticate())); //get user who wants to authenticate
passport.serializeUser(User.serializeUser()); //save user_.id to the session, encrypting password
passport.deserializeUser(User.deserializeUser()); //receive user._id from the session and fetch him from DB

//Set up routes
// // here app.use('/route', controllerName);
app.use('/', authController);

//Testing if page displays correctly, delete afterwise
app.get('/', (req, res) => {
	console.log('GET /');
	res.send('It works!');
});

app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});
