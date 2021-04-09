var express = require('express');
var router = express.Router();


router.get('/', (req, res) => {
    res.render('about', { userId : req.session.auth ? req.session.auth.userId : null} )
})




module.exports = router;
