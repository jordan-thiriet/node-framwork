var express = require('express');
var oAuth = require('../model/oAuth.js');
var router = express.Router();

router.post('/reset-password',function (req, res, next) {
    oAuth.resetPassword(req.body.email, function(err, user) {
        if(err) {
            res.status(500).send({error: err});
        } else if(!user) {
            res.status(400).send({error: 'unknow_email'});
        } else {
            res.status(200).send();
        }
    });
});

module.exports = router;