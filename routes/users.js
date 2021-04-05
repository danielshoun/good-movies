var express = require('express');
var router = express.Router();
const { User } = require('../db/models')
const { asyncHandler, handleValidationErrors } = require('../utils')
const { check } = require('express-validator')
const bcrypt = require('bcrypt')
const csrf = require('csurf')
const csrfProtection = csrf({ cookie: true });
const { generateUserToken, requireAuth } = require('../auth');

const emailandpasswordValidators = [
	check('email')
		.exists({ checkFalsy: true })
		.isEmail()
		.normalizeEmail()
		.withMessage('Please enter a valid email')
		.isLength({ max: 255 })
		.withMessage('Your email address is too long')
		.custom(async (value) => {
			const user = await User.findOne({ where: { email: value } })
			if (user) {
				throw new Error('User already exists with email')
			} else {
				return value
			}
		}),
	check('password')
		.exists({ checkFalsy: true })
		.withMessage('Please enter a valid password')
];

const loginValidators = [
	check('email')
		.exists({ checkFalsy: true })
		.isEmail()
		.normalizeEmail()
		.withMessage('Please enter a valid email')
		.isLength({ max: 255 })
		.withMessage('Your email address is too long'),
	check('password')
		.exists({ checkFalsy: true })
		.withMessage('Please enter a valid password')
];

const usernameandConfirmedPasswordValidators = [
	check('username')
		.exists({ checkFalsy: true })
		.withMessage("Please enter a valid username")
		.isLength({ max: 50 })
		.withMessage("Username is too long")
		.custom(async (value) => {
			const user = await User.findOne({ where: { username: value } })
			if (user) {
				throw new Error('User already exists with this username')
			} else {
				return value
			}
		}),
	check('confirmedPassword')
		.isStrongPassword()
		.withMessage("Password must contain 1 lowercase letter, 1 uppercase letter, 1 digit, 1 special character")
		.custom((value, { req }) => {
			if (value !== req.body.password) {
				throw new Error('Passwords do not match');
			} else return value;
		})
];

const registrationValidators = [...emailandpasswordValidators, ...usernameandConfirmedPasswordValidators]

/* GET users listing. */
router.get('/', function (req, res, next) {
	res.send('respond with a resource');
});

router.get('/signup', csrfProtection, function (req, res, next) {
	const user = User.build();
	res.render('signup', { user, title: "Sign Up", csrfToken: req.csrfToken() });
});

router.post('/signup', csrfProtection, registrationValidators, handleValidationErrors, asyncHandler(async (req, res, next) => {
	const { username, email, password } = req.body;

	const hashedPassword = await bcrypt.hash(password, 10)
	const user = await User.build({
		username,
		email,
		hashedPassword
	});
	try {
		await user.save();
		const token = generateUserToken(user);
		res.status(201).json({
			user: { id: user.id },
			token
		});
	} catch (e) {
		next(e);
	}
}));

router.get('/login', csrfProtection,
	asyncHandler(async (req, res, next) => {
		res.render('login', { title: "Log In", csrfToken: req.csrfToken() })
	}))


router.post('/login', loginValidators,
	csrfProtection,
	handleValidationErrors,
	asyncHandler(async (req, res, next) => {
		const { email, password } = req.body
		const user = await User.findOne({ where: { email: email } })

		if (user && await bcrypt.compare(password, user.hashedPassword.toString())) {
			const token = generateUserToken(user)
			res.status(200).json({
				user: { id: user.id },
				token
			})
		} else {
			const err = new Error("Log in failed.")
			err.status = 401
			err.title = "Log in failed."
			err.errors = ["Email or password are invalid."]
			next(err)
		}
	}))
module.exports = router;
