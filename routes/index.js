var express = require('express');
var router = express.Router();
const { Movie } = require('../db/models');

/* GET home page. */
router.get('/', async (req, res, next) => {

	const recentMovies = await Movie.findAll({
		order: [['releaseDate', 'DESC']],
		limit: 10,
	});

	const bestMovies = await Movie.findAll({
		order: [['imdbRating', 'DESC']],
		limit: 10
	})

	res.render('index', { title: 'Home page', recentMovies, bestMovies, userId: req.session.auth ? req.session.auth.userId : null });
});

module.exports = router;
