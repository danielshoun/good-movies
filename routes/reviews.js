var express = require('express');
var router = express.Router();
const { Movie, Review, User } = require('../db/models');
const { asyncHandler, handleValidationErrors } = require('../utils');
const { check, validationResult } = require('express-validator');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

router.post(
	'/movies/:id/reviews',
	csrfProtections,
	asyncHandler(async (req, res, next) => {
		const movieId = parseInt(req.params.id, 10);
		const { reviewText } = req.body;
		// const currentTime = new Date();

		const review = Review.build({
			reviewText: reviewText,
			movieId: movieId,
			userId: userId,
		});

		const validatorErrors = validationResult(req);

		if (validatorErrors.isEmpty()) {
			await review.save();
			res.redirect(`/movies/${movieId}`);
		} else {
			const errors = validatorErrors.array().map(err => err.msg);
			res.render(`movie-details`, { errors: errors, title: 'Movie Details', csrfToken: req.csrfToken(), user });
		}
	})
);

module.exports = router;
