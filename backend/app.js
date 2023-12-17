require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require('morgan');

const session = require('express-session');
const passport = require('passport');

const cookieParser = require('cookie-parser');
const createError = require('http-errors');

// Utility modules
const { connectToMongoDB } = require('./utils/mongooseConnection');
const configPassport = require('./utils/configPassport');
const globalErrorHandler = require('./utils/globalErrorHandler');

// Routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const apiUserRouter = require('./routes/api_users');
const apiChatRouter = require('./routes/api_chats');
const apiMessageRouter = require('./routes/api_messages');

/**
 * ------------ General Setup ---------------
 */
const app = express();
// Enable CORS for all routes, place before session and passport
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Enable CORS if needed
app.use(cors());

// Static file serving middleware
app.use(express.static(path.join(__dirname, 'public')));

// Logging middleware
app.use(logger('dev'));

/**
 * ------------ MongoDB Setup ---------------
 */
// Set up mongoose connection and monitor errors
connectToMongoDB();

/**
 * ------------ Session Setup ---------------
 */
// ^Make sure to add SESSION_SECRET in .env
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

/**
 * ------------ Passport Setup ---------------
 */
// Place after the session middleware but before view set up
configPassport();
app.use(passport.initialize());
app.use(passport.session());

/**
 * ------------ Other Middleware ---------------
 */
// Placing express-session and passport middleware before the middleware
// that parses request data (express.json(), express.urlencoded()) and cookies
// (cookieParser()) ensures that these modules have access to and can manipulate
// the incoming request and response objects as needed for session management
// and user authentication.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/**
 * ------------ Routes ---------------
 */
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/users', apiUserRouter);
app.use('/api/chats', apiChatRouter);
app.use('/api/messages', apiMessageRouter);

// Middleware to handle requests with unhandled routes with a '404 Not Found' error
app.use(function (req, res, next) {
  next(createError(404));
});

/**
 * ------------ Global Error Handler ---------------
 */
// This is the last middleware to execute for a http request
app.use(globalErrorHandler);

module.exports = app;
