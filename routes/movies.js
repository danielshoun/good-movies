var express = require('express');
var router = express.Router();
const { Movie, Review, User, MovieList, Rating } = require('../db/models');
const { asyncHandler, handleValidationErrors } = require('../utils');
const Sequelize = require('sequelize')
const { check, validationResult } = require('express-validator');
const { restoreUser } = require('../auth')
const csrf = require('csurf');

const csrfProtection = csrf({cookie: true});

router.get('/', asyncHandler(async (req, res, next) => {
	let movies;
	let movieCount;

	let movieFind = {
		limit: 50,
		offset: (req.query.page - 1) * 50 || 0,
		order: [['releaseDate', 'DESC']]
	}

	if(req.query.title) {
		movieFind.where = { title: { [Sequelize.Op.iLike]: `%${req.query.title}%`} }
	}

	if(req.query.column && req.query.order) {
		movieFind.order = [[req.query.column, req.query.order]]
	}

	try {
		movies = await Movie.findAll(movieFind)
	} catch (e) {
		console.log(e)
	}

	if(movieFind.where) {
		movieCount = await Movie.count({ where: movieFind.where });
	} else {
		movieCount = await Movie.count();
	}

	console.log('Page Count: ', Math.ceil(movieCount / 50))
	res.render('movies', {
		currentPage: req.query.page ? req.query.page : 1,
		movies,
		titleSearch: req.query.title,
		sortColumn: req.query.column || 'releaseDate',
		sortOrder: req.query.order || 'DESC',
		pageCount: Math.ceil(movieCount / 50),
		userId: req.session.auth ? req.session.auth.userId : null})
}));

router.get(
	'/:id(\\d+)',
	csrfProtection,
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

		avgRating = parseFloat(avgRating[0].dataValues.score).toFixed(1)

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

		let ownReview = await Review.findOne({ where: { userId, movieId }, include: [User] });
		if (ownReview) {
			ownReview.reviewDate = ownReview.createdAt.toDateString() + ' ' + ownReview.createdAt.toLocaleTimeString();
		}
		Object.keys(reviews).map(index => {
			reviews[index].reviewDate =
				reviews[index].createdAt.toDateString() + ' ' + reviews[index].createdAt.toLocaleTimeString();
		});

		let movieLists;
		if(userId) {
			movieLists = await MovieList.findAll({ where: {userId: userId} });
		}
		res.render('movie-details', {
			movieLists,
			movie,
			reviews,
			avgRating,
			prevRating,
			title: 'Movie Details',
			userId,
			ownReview,
			csrfToken: req.csrfToken()
		});
	})
);


const reviewValidator = [
	check('reviewText')
		// .exists({checkFalsy: true})
		.isLength({ min:5})
		.withMessage('Review must be at least 5 characters'),
];


router.post(
	'/:id(\\d+)/',
	csrfProtection,
	reviewValidator,
	restoreUser,
	asyncHandler(async (req, res, next) => {
		if(!req.session.auth) {
			return res.redirect('/users/login')
		}

		const movieId = parseInt(req.params.id, 10);
		const { reviewText } = req.body;
		const { userId } = req.session.auth
		const review = await Review.build({
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

		if (isNaN(avgRating)) {
			avgRating = 'N/A'
		}

		let reviews = await Review.findAll({
			where: {
				movieId: movieId,
			},
			include: [User],
		});

		let ownReview = await Review.findOne({ where: { userId, movieId }, include: [User] });
		if(ownReview) {
			ownReview.reviewDate = ownReview.createdAt.toDateString() + ' ' + ownReview.createdAt.toLocaleTimeString();
		}
		Object.keys(reviews).map(index => {
			// {key: "1"{createdAt:"value"}}
			reviews[index].reviewDate =
				reviews[index].createdAt.toDateString() + ' ' + reviews[index].createdAt.toLocaleTimeString();
		});

		let movieLists;
		if(userId) {
			movieLists = await MovieList.findAll({ where: {userId: userId} });
		}
			const errors = validatorErrors.array().map(err => err.msg);
			res.render(`movie-details`, { errors: errors, movieLists, movie, reviews, avgRating, prevRating, title: 'Movie Details', userId, ownReview });
		}
	})

);

module.exports = router;
