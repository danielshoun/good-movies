var express = require('express');
var router = express.Router();
const { Movie, Review, User, MovieList, Rating } = require('../db/models');
const { asyncHandler, handleValidationErrors } = require('../utils');
const Sequelize = require('sequelize')

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

		let avgRating = await Rating.findAll( {
			where: {
				movieId: movieId,
			},
			attributes: [[Sequelize.fn("AVG", Sequelize.col('score')), "score"]]
		})

		let prevRating = await Rating.findOne({ where: { userId: userId, movieId: movieId} })


		avgRating = parseFloat(avgRating[0].dataValues.score).toFixed(1)
		// console.log(parseFloat(avgRating[0].dataValues.score).toFixed(2))

		if (isNaN(avgRating)) {
			avgRating = 'N/A'
		}

		let reviews = await Review.findAll({
			where: {
				movieId: movieId,
			},
			include: [User],
		});

		let ratings = await Rating.findAll({
			where: {
				movieId: movieId
			},
			include: [User]
		})

		let userInfo = { }

		reviews.forEach( review => {
			if(userInfo[review.User.username]) {
				userInfo[review.User.username].review = review
			} else {
				userInfo[review.User.username] = {}
				userInfo[review.User.username].review = review
			}


		})

		ratings.forEach( rating => {
			if(userInfo[rating.User.username]) {
				userInfo[rating.User.username].rating = rating;
			} else {
				userInfo[rating.User.username] = {};
				userInfo[rating.User.username].rating = rating;
			}
		})

		console.log("User Info: ")
		console.log(userInfo);

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
		res.render('movie-details', { movieLists, movie, reviews, avgRating, prevRating, title: 'Movie Details', userId, ownReview });
	})
);

module.exports = router;
