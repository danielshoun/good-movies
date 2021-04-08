var express = require('express');
var router = express.Router();
const { Movie, Review, User, MovieList, Rating } = require('../db/models');
const { asyncHandler, handleValidationErrors } = require('../utils');
const Sequelize = require('sequelize')

router.get('/', function (req, res, next) {
	res.send('respond with a resource');
});

router.get(
	'/:id(\\d+)',
	asyncHandler(async (req, res, next) => {
		const movieId = parseInt(req.params.id, 10);
		const userId = req.session.auth ? req.session.auth.userId : null

		const movie = await Movie.findByPk(movieId);
		movie.genres = movie.genres.join(', ');
		movie.cast = movie.cast.join(', ');

		let avgRating = await Rating.findAll( {
			where: {
				movieId: movieId,
			},
			attributes: [[Sequelize.fn("AVG", Sequelize.col('score')), "score"]]
		})


		avgRating = parseFloat(avgRating[0].dataValues.score).toFixed(1)
		// console.log(parseFloat(avgRating[0].dataValues.score).toFixed(2))

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
		res.render('movie-details', { movieLists, movie, reviews, avgRating, title: 'Movie Details', userId, ownReview });
	})
);

module.exports = router;
