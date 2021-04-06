const express = require('express')
const router = express.Router()
const { User, Movie, MovieLists, MoviesAndLists } = require('../db/models')
const { asyncHandler } = require('../utils')

router.get('/', asyncHandler(async (req, res, next) => {
    //get each of user's lists
    //render every movie from each of their lists
    const currentUserId = req.params.id
    const movieLists = await MovieLists.findAll({ where: { userId: currentUserId } })
    const moviesAndLists = await MoviesAndLists.findAll({ where: { movieListsId: movieLists.id } })

    console.log('movieLists:', movieLists)
    console.log('moviesAndLists:', moviesAndLists)

    res.render('movieList', {title: 'Movie Lists', moviesAndLists})
}))

module.exports = router

//demo user password !== hashedPassword????