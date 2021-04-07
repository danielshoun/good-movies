const express = require('express')
const router = express.Router()
const { User, Movie, MovieList, MoviesAndLists } = require('../db/models')
const { asyncHandler } = require('../utils')
const { restoreUser } = require('../auth')

router.get('/', restoreUser, asyncHandler(async (req, res, next) => {
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
}))

module.exports = router

//demo user password !== hashedPassword????