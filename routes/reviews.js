var express = require('express');
var router = express.Router();
const { Movie, Review, User } = require('../db/models');
const { asyncHandler, handleValidationErrors } = require('../utils');
const { check, validationResult } = require('express-validator');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });
const { restoreUser } = require('../auth')


const reviewValidator = [
	check('reviewText')
		// .exists({checkFalsy: true})
		.isLength({ min:5})
		.withMessage('Review must be at least 5 characters'),
];



router.delete(
	'/:id(\\d+)',
	restoreUser,
	asyncHandler( async(req, res, next) => {
		const movieId = parseInt(req.params.id, 10);
		const { userId } = req.session.auth

		await Review.destroy( { where: { userId, movieId }})

		res.sendStatus(204);

	})
)

router.put(
	'/:id(\\d+)',
	restoreUser,
	asyncHandler(async (req, res, next) => {
		const movieId = parseInt(req.params.id, 10);
		const { userId } = req.session.auth
		const newReview = req.body.newReview;
		const owner = await Review.findOne( {where: {userId, movieId }});

		owner.reviewText = newReview;

		await owner.save();

		res.sendStatus(200);

	})
)

module.exports = router;
