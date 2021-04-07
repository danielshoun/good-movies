const express = require('express')
const router = express.Router()
const { User, Movie, MovieList, MoviesAndLists } = require('../db/models')
const { asyncHandler } = require('../utils')
const { restoreUser } = require('../auth')

router.get('/', restoreUser, asyncHandler(async (req, res, next) => {
    if(res.locals.authenticated) {
        //get each of user's lists
        //render every movie from each of their lists
        const currentUserId = res.locals.user.id

        console.log(currentUserId)

        const movieLists = await MovieList.findAll({
            where: { userId: currentUserId },
            include: Movie
        })
        // const moviesAndLists = await MoviesAndLists.findAll({ where: { movieListsId: movieLists.id } })

        console.log('movieLists:', movieLists)

        res.render('movieList', {title: 'Movie Lists', movieLists})
    } else {
        res.redirect('/users/login')
    }

}))

router.get('/:id(\\d+)', restoreUser, asyncHandler(async (req, res, next) => {
    if(res.locals.authenticated) {
        const currentUserId = res.locals.user.id;
        const movieListId = req.params.id;

        const currentMovieList = await MovieList.findByPk(movieListId, {include: Movie});
        const movieLists = await MovieList.findAll({where: {userId: currentUserId}});

        res.render('movieList', {title: 'Movie Lists', currentMovieList, movieLists});
    }
}))

module.exports = router

//demo user password !== hashedPassword????