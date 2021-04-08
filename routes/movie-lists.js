const express = require('express')
const router = express.Router()
const { User, Movie, MovieList, MoviesAndLists } = require('../db/models')
const { asyncHandler } = require('../utils')
const { restoreUser } = require('../auth')

router.get('/', restoreUser, asyncHandler(async (req, res, next) => {
    if (res.locals.authenticated) {
        //get each of user's lists
        //render every movie from each of their lists
        const currentUserId = res.locals.user.id

        // console.log(currentUserId)

        const movieLists = await MovieList.findAll({
            where: { userId: currentUserId },
            include: Movie,
            order: [['id', 'ASC']]
        })
        // const moviesAndLists = await MoviesAndLists.findAll({ where: { movieListsId: movieLists.id } })

        // console.log('movieLists:', movieLists)

        res.render('movieList', { title: 'Movie Lists', movieLists })
    } else {
        res.redirect('/users/login')
    }

}))

router.get('/:id(\\d+)', restoreUser, asyncHandler(async (req, res, next) => {
    if (res.locals.authenticated) {
        const currentUserId = res.locals.user.id;
        const movieListId = req.params.id;

        const currentMovieList = await MovieList.findByPk(movieListId, { include: Movie });
        const movieLists = await MovieList.findAll({ where: { userId: currentUserId } });

        // const movies = await MovieList.findAll({
        // 	where: { userId: currentUserId },
        // 	include:
        // });

        res.render('movieList', { title: 'Movie Lists', currentMovieList, movieLists });
    }
}))

router.post('/', restoreUser, asyncHandler(async (req, res, next) => {
    if (res.locals.authenticated) {
        const newListName = req.body.newListName
        if (newListName) {
            const newList = await MovieList.create({ name: newListName, isDefault: false, userId: res.locals.user.id })

            res.json(newList)
        }

        //plus sign
        const movieListId = req.body.movieListId
        const movieId = req.body.movieId

        if (movieListId && movieId) {
            await MoviesAndLists.create({ movieListId: movieListId, movieId: movieId })
            res.sendStatus(204)
        }

    } else {
        res.sendStatus(401)
    }
}))

router.delete('/', restoreUser, asyncHandler(async (req, res, next) => {
    if (res.locals.authenticated) {
        const movieToDelete = req.body.movieId
        const movieListToDelete = req.body.listId

        await MoviesAndLists.destroy({
            where: {
                movieId: movieToDelete,
                movieListId: movieListToDelete
            }
        })

        res.sendStatus(204)
    } else {
        res.sendStatus(401)
    }
}))

router.get('/settings', restoreUser, asyncHandler(async (req, res, next) => {
    if (res.locals.authenticated) {
        const currentUserId = res.locals.user.id;

        const movieLists = await MovieList.findAll({
            where: { userId: currentUserId },
            include: Movie,
            order: [['id', 'ASC']]
        });

        res.render('list-settings', { movieLists })
    } else {
        res.redirect('/')
    }
}))

router.delete('/settings', restoreUser, asyncHandler(async (req, res, next) => {
    if (res.locals.authenticated) {
        const movieListIds = req.body.listId

        movieListIds.forEach(async movieListId => {
            await MoviesAndLists.destroy({ where: { movieListId: movieListId } })
            await MovieList.destroy({ where: { id: movieListId } })
        })

        res.sendStatus(204)
    } else {
        res.sendStatus(401)
    }
}))

router.put('/settings', restoreUser, asyncHandler(async (req, res, next) => {
    if (res.locals.authenticated) {
        const movieListId = req.body.listId;
        const newName = req.body.newName;

        let list = await MovieList.findByPk(movieListId);
        if (list.isDefault) {
            res.sendStatus(400);
        } else {
            list.name = newName
            await list.save();

            res.sendStatus(204);
        }

    } else {
        res.sendStatus(401);
    }
}))

router.post('/:id(\\d+)', restoreUser, asyncHandler(async (req, res, next) => {
    const listId = req.params.id;
    const movieId = req.body.movieId;
    const { userId } = req.session.auth

    const list = MovieList.findByPk(listId, { include: [User] })

    if (list.User.id === userId) {

        if (list.name === 'Watched') {
            const toWatchedList = MovieList.findOne( {where: {name: "To Watch", userId: userId}, include: [Movie]})

            await MoviesAndLists.destroy( {where: {movieListId: toWatchedList.id, movieId: movieId}})

            // let indexToDelete = -1;

            // toWatchedList.Movie.forEach((movie, i) => {
            //     if(movie.id === movieId) {
            //         indexToDelete = i;
            //     }
            // })

            // if(indexToDelete !== -1) {
            //     toWatchedList.Movie.splice(indexToDelete, 1)
            //     await toWatchedList.save();
            // }


        }

        await MoviesAndLists.create({ movieId: movieId, movieListId: listId });
        res.sendStatus(201);
    } else {
        res.sendStatus(401)
    }




}))

module.exports = router

//demo user password !== hashedPassword????
