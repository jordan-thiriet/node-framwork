var express = require('express');
var oAuth = require('../model/oAuth.js');
var router = express.Router();

router.get('/user/:id',function (req, res, next) {
    oAuth.getUserById(req.params.id,function(err, data) {
        if(err) {
            res.status(500).send({data: {error: err}});
        } else {
            var user = {
                id: data._id,
                username: data.username,
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email
            };
            res.status(200).send(user);
        }
    });
});

router.put('/user/:id',function (req, res, next) {
    oAuth.updateUser(req.params.id, req.body, function(err, user) {
        if(err) {
            res.status(500).send({data: {error: err}});
        } else {
            res.status(200).send();
        }
    });
});

router.post('/user/change-password/:id',function (req, res, next) {
    oAuth.updatePassword(req.params.id, req.body.newPwd, function(err, user) {
        if(err) {
            res.status(500).send({data: {error: err}});
        } else {
            res.status(200).send();
        }
    });
});

router.get('/user',function (req, res, next) {
    var matches = req.get('Authorization').match(/Bearer\s(\S+)/);
    var token = matches[1];
    oAuth.getUserFromToken(token,function(err, data) {
        if(err) {
            res.status(400).send({data: {error: err}});
        } else {
            var user = {
                id: data.userId._id,
                username: data.userId.username,
                email: data.userId.email
            };
            res.status(200).send(user);
        }
    });
});

router.put('/user',function (req, res, next) {
    req.get('Authorization');
});

module.exports = router;