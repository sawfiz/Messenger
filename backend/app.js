require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

// Routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const apiUserRouter = require('./routes/api_users');
const apiMessageRouter = require('./routes/api_messages');

// Utility modules
const { connectToMongoDB } = require('./utils/mongooseConnection');
// const configPassport = require('./utils/configPassport');
// const globalErrorHandler = require('./utils/globalErrorHandler');

// Main program
var app = express();
app.use(cors()); // Enable CORS for all routes

// Set up mongoose connection and monitor errors
connectToMongoDB();

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
app.use('/api/messages', apiMessageRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
