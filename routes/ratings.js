var express = require('express');
var router = express.Router();
const { Movie, Review, Rating, User } = require('../db/models');
const { asyncHandler, handleValidationErrors } = require('../utils');
const { check, validationResult } = require('express-validator');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });
const { restoreUser } = require('../auth')


module.exports = router;