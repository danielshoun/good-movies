const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { sequelize } = require('./db/models');
const session = require('express-session');
const { sessionSecret, environment } = require('./config/index');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const reviewsRouter = require('./routes/reviews')
const movieListRouter = require('./routes/movie-lists')
const ratingsRouter = require('./routes/ratings')
const aboutRouter = require('./routes/about')
const app = express();

// view engine setup
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// set up session middleware
const store = new SequelizeStore({ db: sequelize });

app.use(
	session({
		secret: sessionSecret,
		store,
		saveUninitialized: false,
		resave: false,
	})
);

// create Session table if it doesn't already exist
store.sync();

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/lists', movieListRouter);
app.use('/movies', moviesRouter);
app.use('/reviews', reviewsRouter)
app.use('/ratings', ratingsRouter)
app.use('/about', aboutRouter)
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
