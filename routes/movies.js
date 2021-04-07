var express = require('express');
var router = express.Router();
const { Movie, Review, User } = require('../db/models');
const { asyncHandler, handleValidationErrors } = require('../utils');

router.get('/', function (req, res, next) {
	res.send('respond with a resource');
});

router.get(
	'/:id(\\d+)',
	asyncHandler(async (req, res, next) => {
		const movieId = parseInt(req.params.id, 10);

		const movie = await Movie.findByPk(movieId);
		movie.genres = movie.genres.join(', ');
		movie.cast = movie.cast.join(', ');

		const reviews = await Review.findAll({
			where: {
				movieId: movieId,
			},
			include: [User],
		});

		res.render('movie-details', { movie, reviews, title: 'Movie Details' });
	})
);

module.exports = router;
