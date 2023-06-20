const createError = require('http-errors')
  , express = require('express')
  , path = require('path')
  , session = require("express-session")
  , cookieParser = require('cookie-parser')
  , logger = require('morgan')
  , passport = require('passport')
  , LocalStrategy = require("passport-local").Strategy
  , db = require('./db')
  , crypto = require('crypto');

//For Environmental Variables
require("dotenv").config();

// For debugging
const debug = require("debug")("app");

// Routes
const indexRouter = require('./routes/index');
const clubhouseRouter = require('./routes/clubhouse');

// For Production Deployment
const compression = require("compression");
const helmet = require("helmet");

const app = express();

// Set up rate limiter: maximum of ten requests per minute
const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});
// Apply rate limiter to all requests
app.use(limiter);

// Add helmet to the middleware chain.
// Set CSP headers to allow our Bootstrap and Jquery to be served
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));

// Session Setup
app.use(
  session({
    secret: process.env.SECRET || crypto.randomBytes(64).toString("hex"),
    resave: false,
    saveUninitialized: true,
  })
);

// Configure and initialize passport
require('./config/passport')(passport, LocalStrategy);
app.use(passport.initialize());
app.use(passport.session());

// app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Cache currentUser for middleware
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});
app.use(cookieParser());
app.use(compression()); // Compress all routes
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/clubhouse', clubhouseRouter(passport));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
