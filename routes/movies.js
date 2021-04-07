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
		console.log(typeof movie.createdAt);
		// Object.keys(reviews).map(index => {
		// 	reviews[index].createdAt = new Date('hello');
		// 	console.log(reviews[index].createdAt);
		// 	// reviews[review].createdAt.toDateString() + " " + reviews[review].createdAt.toLocaleTimeString()
		// });

		// console.log(reviews);
		const movieLists = await MovieList.findAll();
		res.render('movie-details', { movieLists, movie, reviews, title: 'Movie Details' });
	})
);

module.exports = router;
