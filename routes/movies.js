var express = require('express');
var router = express.Router();
const { Movie, Review, User, MovieList, Rating } = require('../db/models');
const { asyncHandler, handleValidationErrors } = require('../utils');
const Sequelize = require('sequelize');

router.get(
	'/',
	asyncHandler(async (req, res, next) => {
		let movies;
		let movieCount;
		if (req.query.title) {
			console.log(req.query.title);
			movies = await Movie.findAll({
				where: {
					title: { [Sequelize.Op.iLike]: `%${req.query.title}%` },
				},
				limit: 50,
				offset: (req.query.page - 1) * 50 || 0,
				order: [['id', 'ASC']],
			});
			movieCount = await Movie.count({
				where: {
					title: { [Sequelize.Op.iLike]: `%${req.query.title}%` },
				},
			});
		} else {
			movies = await Movie.findAll({
				limit: 50,
				offset: (req.query.page - 1) * 50 || 0,
				order: [['id', 'ASC']],
			});
			movieCount = await Movie.count();
		}
		console.log('Page Count: ', Math.ceil(movieCount / 50));
		res.render('movies', {
			currentPage: req.query.page ? req.query.page : 1,
			movies,
			titleSearch: req.query.title,
			pageCount: Math.ceil(movieCount / 50),
			userId: req.session.auth ? req.session.auth.userId : null,
		});
	})
);

router.get(
	'/:id(\\d+)',
	asyncHandler(async (req, res, next) => {
		const movieId = parseInt(req.params.id, 10);
		const userId = req.session.auth ? req.session.auth.userId : null;

		const movie = await Movie.findByPk(movieId);
		movie.genres = movie.genres.join(', ');
		movie.cast = movie.cast.join(', ');

		let avgRating = await Rating.findAll({
			where: {
				movieId: movieId,
			},
			attributes: [[Sequelize.fn('AVG', Sequelize.col('score')), 'score']],
		});

		let prevRating = await Rating.findOne({ where: { userId: userId, movieId: movieId } });

		avgRating = parseFloat(avgRating[0].dataValues.score).toFixed(1);
		// console.log(parseFloat(avgRating[0].dataValues.score).toFixed(2))

		if (isNaN(avgRating)) {
			avgRating = 'N/A';
		}

		let reviews = await Review.findAll({
			where: {
				movieId: movieId,
			},
			include: [
				{
					model: User,
					include: [
						{
							model: Rating,
							required: false,
							where: {
								movieId: movieId,
							},
						},
					],
				},
			],
		});

		reviews.forEach(review => {
			review.User.Ratings.forEach(rating => {
				// console.log(rating.score);
			});
		});
		console.log(reviews[1].User.Ratings[0].score);

		// let userInfo = {};
		// userInfo.rating = reviews[0].User.Ratings;
		// console.log(userInfo);
		// let ratings = await Rating.findAll({
		// 	where: {
		// 		movieId: movieId
		// 	},
		// 	include: [User]
		// })

		// VVV May not be necessary? VVV
		// let userInfo = { }
		//
		// reviews.forEach( review => {
		// 	if(userInfo[review.User.username]) {
		// 		userInfo[review.User.username].review = review
		// 	} else {
		// 		userInfo[review.User.username] = {}
		// 		userInfo[review.User.username].review = review
		// 	}
		//
		//
		// })
		//
		// ratings.forEach( rating => {
		// 	if(userInfo[rating.User.username]) {
		// 		userInfo[rating.User.username].rating = rating;
		// 	} else {
		// 		userInfo[rating.User.username] = {};
		// 		userInfo[rating.User.username].rating = rating;
		// 	}
		// })
		//
		// console.log("User Info: ")
		// console.log(userInfo);

		let ownReview = await Review.findOne({ where: { userId, movieId }, include: [User] });
		if (ownReview) {
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
		res.render('movie-details', {
			movieLists,
			movie,
			reviews,
			avgRating,
			prevRating,
			title: 'Movie Details',
			userId,
			ownReview,
		});
	})
);

module.exports = router;
