var express = require('express');
var router = express.Router();
const { Movie, Review, User } = require('../db/models');
const { asyncHandler, handleValidationErrors } = require('../utils');
const { check, validationResult } = require('express-validator');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });
const { restoreUser } = require('../auth')

router.post(
	'/:id(\\d+)/',
	// csrfProtection,
	restoreUser,
	asyncHandler(async (req, res, next) => {
		const movieId = parseInt(req.params.id, 10);
		const { reviewText } = req.body;
		// const currentTime = new Date();
		const { userId } = req.session.auth
		console.log(req.body)
		const review = Review.build({
			reviewText: reviewText,
			movieId: movieId,
			userId: userId,
		});

		let ownReview = await Review.findOne({ where: { userId, movieId }, include: [User] });

		if(ownReview) {
			res.redirect(`/movies/${movieId}`)
		}

		const validatorErrors = validationResult(req);

		if (validatorErrors.isEmpty()) {
			await review.save();
			res.redirect(`/movies/${movieId}`);
		} else {
			const errors = validatorErrors.array().map(err => err.msg);
			res.render(`movie-details`, { errors: errors, title: 'Movie Details', review });
		}
	})

);

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
