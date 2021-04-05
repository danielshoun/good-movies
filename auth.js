const jwt = require('jsonwebtoken');
const bearerToken = require('express-bearer-token');
const { jwtConfig } = require('./config');
const { User } = require('./db/models');

function generateUserToken(user) {
    const { id, username, email } = user

    const payload = {
        id: id,
        username: username,
        email: email
    }

    const token = jwt.sign({ data: payload }, jwtConfig.jwtSecret, { expiresIn: parseInt(jwtConfig.jwtExpiresIn, 10) })
    return token
}

function restoreUser(req, res, next) {
    const { token } = req;

    if (!token) {
        const err = new Error("Unauthorized")
        err.status = 401
        return next(err)
    }

    jwt.verify(token, jwtConfig.jwtSecret, async (err, jwtPayload) => {
        if (err) {
            err.status = 401
            return next(err)
        }

        const { id } = jwtPayload.data

        try {
            req.user = await User.findByPk(id)

        } catch (error) {
            return next(error)
        }

        if (!req.user) {
            const err = new Error("Unauthorized")
            err.status = 401
            return next(err)
        }

        next()
    })
}

const requireAuth = [bearerToken(), restoreUser]

module.exports = { requireAuth, generateUserToken }