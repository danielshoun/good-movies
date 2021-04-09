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

        const movieLists = await MovieList.findAll({
            where: { userId: currentUserId },
            include: Movie,
            order: [['id', 'ASC']]
        })
        res.render('movieList', { title: 'Movie Lists', movieLists, userId: req.session.auth ? req.session.auth.userId : null })
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

        res.render('movieList', { title: 'Movie Lists', currentMovieList, movieLists, userId: req.session.auth ? req.session.auth.userId : null });
    }
}))

router.post('/', restoreUser, asyncHandler(async (req, res, next) => {
    if (res.locals.authenticated) {
        const newListName = req.body.newListName
        if (newListName) {
            if(newListName === 'Watched' || newListName === 'To Watch') {
                res.sendStatus(400);
            } else {
                const newList = await MovieList.create({ name: newListName, isDefault: false, userId: res.locals.user.id })
                res.json(newList)
            }
        }

        // plus sign
        // const movieListId = req.body.movieListId
        // const movieId = req.body.movieId
        //
        // if (movieListId && movieId) {
        //     await MoviesAndLists.create({ movieListId: movieListId, movieId: movieId })
        //     res.sendStatus(204)
        // }

    } else {
        res.sendStatus(401)
    }
}))

router.post('/watched', asyncHandler(async (req, res, next) => {
    const { movieId } = req.body;
    const { userId } = req.session.auth;
    const watchedList = await MovieList.findOne({ where: { name: "Watched", userId: userId }})
    console.log(watchedList)
    try {
        await MoviesAndLists.create({movieId: movieId, movieListId: watchedList.id});
        res.sendStatus(200);
    } catch (e) {
        res.sendStatus(400)
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

        res.render('list-settings', { movieLists, userId: req.session.auth ? req.session.auth.userId : null })
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

        if(newName === "Watched" || newName === "To Watch") {
            return res.sendStatus(400);
        }

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

    const list = await MovieList.findByPk(listId, { include: [User] })

    if (list.User.id === userId) {
        if (list.name === 'Watched') {
            const toWatchList = await MovieList.findOne( {where: {name: "To Watch", userId: userId}})
            await MoviesAndLists.destroy( {where: {movieListId: toWatchList.id, movieId: movieId}})
        } else if (list.name === 'To Watch') {
            const watchedList = await MovieList.findOne( {where: {name: "Watched", userId: userId}})
            await MoviesAndLists.destroy( {where: {movieListId: watchedList.id, movieId: movieId}})
        }
        await MoviesAndLists.create({ movieId: movieId, movieListId: listId });
        res.sendStatus(201);
    } else {
        res.sendStatus(401)
    }

}))

module.exports = router

//demo user password !== hashedPassword????
