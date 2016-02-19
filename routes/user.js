var express = require('express');
var fs = require('fs');
var oAuth = require('../model/oAuth.js');
var router = express.Router();

router.get('/:id',function (req, res, next) {
    oAuth.getUserById(req.params.id,function(err, data) {
        if(err) {
            res.status(500).send({error: err});
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

router.put('/:id',function (req, res, next) {
    if(req.body.picture) {
        var base64Data = req.body.picture.replace(/^data:image\/png;base64,/, "");

        fs.writeFile("public/pictures/"+req.params.id+".png", base64Data, 'base64', function(err) {
            if(err)
                console.log(err);
        });
    }
    oAuth.updateUser(req.params.id, req.body, function(err, user) {
        if(err) {
            res.status(500).send({error: err});
        } else {
            res.status(200).send();
        }
    });
});

router.post('/change-password/:id',function (req, res, next) {
    oAuth.updatePassword(req.params.id, req.body.newPwd, function(err, user) {
        if(err) {
            res.status(500).send({error: err});
        } else {
            res.status(200).send();
        }
    });
});

router.get('/',function (req, res, next) {
    var matches = req.get('Authorization').match(/Bearer\s(\S+)/);
    var token = matches[1];
    oAuth.getUserFromToken(token,function(err, data) {
        if(err) {
            res.status(400).send({error: err});
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

module.exports = router;