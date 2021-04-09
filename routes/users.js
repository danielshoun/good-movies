var express = require('express');
var router = express.Router();
const { User, MovieList } = require('../db/models');
const { asyncHandler, handleValidationErrors } = require('../utils');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });
const { loginUser, logoutUser } = require('../auth');
// const { validator } = require('sequelize/types/lib/utils/validator-extras');

const emailandpasswordValidators = [
	check('email', 'Please enter a valid email')
		.normalizeEmail()
		.isEmail()
		.withMessage('Please enter a valid email'),
	check('email')
		.isLength({ max: 255 })
		.withMessage('Your email address is too long')
		.custom(async value => {
			const user = await User.findOne({ where: { email: value } });
			if (user) {
				throw new Error('User already exists with email');
			} else {
				return value;
			}
		}),
	check('password').exists({ checkFalsy: true }).withMessage('Please enter a valid password'),
];

const loginValidators = [
	check('email', 'Please enter a valid email')
		.normalizeEmail()
		.isEmail()
		.normalizeEmail(),
	check('email')
		.isLength({ max: 255 })
		.withMessage('Your email address is too long'),
	check('password').exists({ checkFalsy: true }).withMessage('Please enter a valid password'),
];

const usernameandConfirmedPasswordValidators = [
	check('username')
		.exists({ checkFalsy: true })
		.withMessage('Please enter a valid username')
		.isLength({ max: 50 })
		.withMessage('Username is too long')
		.custom(async value => {
			const user = await User.findOne({ where: { username: value } });
			if (user) {
				throw new Error('User already exists with this username');
			} else {
				return value;
			}
		}),
	check('confirmedPassword')
		.isStrongPassword()
		.withMessage('Password must contain 1 lowercase letter, 1 uppercase letter, 1 digit, 1 special character'),
	check('confirmedPassword', 'Passwords do not match')
		.custom((value, { req }) => {
			if (value !== req.body.password) {
				throw new Error('Passwords do not match');
			} else return value;
		}),
];

const registrationValidators = [...emailandpasswordValidators, ...usernameandConfirmedPasswordValidators];

/* GET users listing. */
router.get('/', function (req, res, next) {
	res.send('respond with a resource');
});

router.get('/signup', csrfProtection, function (req, res, next) {
	if(req.session.auth) {
		res.redirect('/')
	} else {
		const user = User.build();
		res.render('signup', { user, title: 'Sign Up', csrfToken: req.csrfToken() });
	}

});

router.post(
	'/signup',
	csrfProtection,
	registrationValidators,
	asyncHandler(async (req, res, next) => {
		const { username, email, password } = req.body;

		const hashedPassword = await bcrypt.hash(password, 10);
		let user = await User.build({
			username,
			email,
			hashedPassword: password,
		});

		const validatorErrors = validationResult(req);

		if (validatorErrors.isEmpty()) {
			user.hashedPassword = hashedPassword;
			user = await user.save();

			await MovieList.create({
				name: 'Watched',
				isDefault: true,
				userId: user.id
			});
			await MovieList.create({
				name: 'To Watch',
				isDefault: true,
				userId: user.id
			});

			loginUser(req, res, user);
			return req.session.save((err) => {
				if(err) {
					next(err)
				} else {
					res.redirect('/')
				}
			})
		} else {
			const errors = validatorErrors.array().map(err => err.msg);
			res.render('signup', { errors: errors, title: 'Sign Up', csrfToken: req.csrfToken(), user });
		}
	})
);

router.get(
	'/login',
	csrfProtection,
	asyncHandler(async (req, res, next) => {
		if(req.session.auth) {
			res.redirect('/')
		} else {
			res.render('login', { title: 'Log In', csrfToken: req.csrfToken() });
		}
	})
);

router.post(
	'/login',
	loginValidators,
	csrfProtection,
	asyncHandler(async (req, res, next) => {
		const { email, password } = req.body;

		const user = await User.findOne({ where: { email } });

		const validatorErrors = validationResult(req);

		const error = []

		if (user && await bcrypt.compare(password, user.hashedPassword.toString())) {
			loginUser(req, res, user);
			return req.session.save((err) => {
				if(err) {
					next(err)
				} else {
					res.redirect('/')
				}
			})
		} else {
			error.push("Incorrect username or password")
		}

		if (!validatorErrors.isEmpty() || error.length > 0) {
			const errors = error.concat(validatorErrors.array().map(err => err.msg));
			res.render('login', { errors: errors, title: 'Log In', csrfToken: req.csrfToken() });
		}
	})
);

router.get('/logout', (req, res, next) => {
	logoutUser(req, res);
	return req.session.save((err) => {
		if(err) {
			next(err)
		} else {
			res.redirect('/')
		}
	})
});


module.exports = router;
