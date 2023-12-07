require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
const passport = require('passport');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

// Routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const apiUserRouter = require('./routes/api_users');
const apiChatRouter = require('./routes/api_chats');
const apiMessageRouter = require('./routes/api_messages');

// Utility modules
const { connectToMongoDB } = require('./utils/mongooseConnection');
const configPassport = require('./utils/configPassport');
const globalErrorHandler = require('./utils/globalErrorHandler');

// Main program
var app = express();
app.use(cors()); // Enable CORS for all routes

// Set up mongoose connection and monitor errors
connectToMongoDB();

// Make sure to add SESSION_SECRET in .env
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Place after the session middleware but before view set up
configPassport();
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/users', apiUserRouter);
app.use('/api/chats', apiChatRouter);
app.use('/api/messages', apiMessageRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// The last middleware to execute, the global error handler
app.use(globalErrorHandler);

module.exports = app;
