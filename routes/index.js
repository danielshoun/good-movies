var express = require('express');
var router = express.Router();
const { Movie } = require('../db/models');

/* GET home page. */
router.get('/', async (req, res, next) => {
	const movies = await Movie.findAll({
		order: [['releaseDate', 'DESC']],
		limit: 10,
	});
	// console.log(movies);
	res.render('index', { title: 'Home page', movies });
});

module.exports = router;
