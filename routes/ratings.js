var express = require('express');
var router = express.Router();
const { Movie, Review, Rating, User } = require('../db/models');
const { asyncHandler, handleValidationErrors } = require('../utils');
const { check, validationResult } = require('express-validator');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });
const { restoreUser } = require('../auth')


router.post('/', restoreUser, asyncHandler(async (req, res, next) => {
    if(!req.session.auth) {
        return res.sendStatus(401);
    }
    const movieId = req.body.movieId;
    const rating = req.body.rating;
    const { userId } = req.session.auth;


    const previousRating = await Rating.findOne({ where: { userId: userId, movieId: movieId } })
    if (previousRating) {
        previousRating.score = rating;
        await previousRating.save();
        res.sendStatus(204)
    } else {
        const newRating = await Rating.create({ userId: userId, movieId: movieId, score: rating })
        res.sendStatus(201)
    }


}))


module.exports = router;
