var express = require('express');
var router = express.Router();
const { Movie, Review, User, MovieList } = require('../db/models');
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

		let reviews = await Review.findAll({
			where: {
				movieId: movieId,
			},
			include: [User],
		});
		// console.log(typeof movie.createdAt);
		Object.keys(reviews).map(index => {
			// {key: "1"{createdAt:"value"}}
			reviews[index].reviewDate =
				reviews[index].createdAt.toDateString() + ' ' + reviews[index].createdAt.toLocaleTimeString();
			// console.log(reviews[index].reviewDate);
		});

		// console.log(reviews);
		const movieLists = await MovieList.findAll();
		res.render('movie-details', { movieLists, movie, reviews, title: 'Movie Details', userId: req.session.auth ? req.session.auth.userId : null });
	})
);

module.exports = router;
