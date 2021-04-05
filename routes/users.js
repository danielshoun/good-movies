var express = require('express');
var router = express.Router();
const { User } = require('../db/models')
const { asyncHandler, handleValidationErrors } = require('../utils')
const bcrypt = require('bcrypt')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/signup', function(req, res, next) {
	const user = User.build();
  res.render('signup', { user });
});

router.post('/', handleValidationErrors, asyncHandler(async (req, res, next) => {
	const { username, email, password } = req.body;

	const hashedPassword = await bcrypt.hash(password, 10)
	const user = await User.build({
		username,
		email,
		hashedPassword
	});
}));

module.exports = router;
