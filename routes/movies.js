var express = require('express');
var router = express.Router();
const { Movie, Review, User, MovieList } = require('../db/models');
const { asyncHandler, handleValidationErrors } = require('../utils');

router.get('/', asyncHandler(async (req, res, next) => {
	const movies = await Movie.findAll({
		limit: 50,
		offset: (req.query.page - 1) * 50 || 0,
		order: [['id', 'ASC']]
	})
	const movieCount = await Movie.count();
	res.render('movies', {currentPage: req.query.page, movies, pageCount: Math.ceil(movieCount / 50)})
}));

router.get(
	'/:id(\\d+)',
	asyncHandler(async (req, res, next) => {
		const movieId = parseInt(req.params.id, 10);
		const userId = req.session.auth ? req.session.auth.userId : null

		const movie = await Movie.findByPk(movieId);
		movie.genres = movie.genres.join(', ');
		movie.cast = movie.cast.join(', ');

		let reviews = await Review.findAll({
			where: {
				movieId: movieId,
			},
			include: [User],
		});

		let ownReview = await Review.findOne({ where: { userId, movieId }, include: [User] });
		if(ownReview) {
			console.log(ownReview.cr);
			ownReview.reviewDate = ownReview.createdAt.toDateString() + ' ' + ownReview.createdAt.toLocaleTimeString();
		}

		// console.log(typeof movie.createdAt);
		Object.keys(reviews).map(index => {
			// {key: "1"{createdAt:"value"}}
			reviews[index].reviewDate =
				reviews[index].createdAt.toDateString() + ' ' + reviews[index].createdAt.toLocaleTimeString();
			// console.log(reviews[index].reviewDate);
		});

		// console.log(reviews);
		const movieLists = await MovieList.findAll();
		res.render('movie-details', { movieLists, movie, reviews, title: 'Movie Details', userId, ownReview });
	})
);

module.exports = router;
