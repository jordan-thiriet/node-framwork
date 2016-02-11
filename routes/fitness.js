var express = require('express');
var oAuth = require('../model/oAuth.js');
var fitness = require('../model/fitness.js');
var router = express.Router();

router.get('/',function (req, res, next) {
    var matches = req.get('Authorization').match(/Bearer\s(\S+)/);
    var token = matches[1];
    oAuth.getUserFromToken(token,function(err, data) {
        if(err) {
            res.status(400).send({error: err});
        } else {
            fitness.getAll(data.userId._id, function(err, fitness) {
                if(err) {
                    res.status(400).send({data: {error: err}});
                } else {
                    res.status(200).send(fitness);
                }
            });
        }
    });
});

router.post('/',function (req, res, next) {
    var matches = req.get('Authorization').match(/Bearer\s(\S+)/);
    var token = matches[1];
    oAuth.getUserFromToken(token,function(err, data) {
        if(err) {
            res.status(400).send({error: err});
        } else {
            fitness.save(req.body, data.userId._id, function(err) {
                if(err) {
                    res.status(500).send({data: {error: err}});
                } else {
                    res.status(200).send();
                }
            });
        }
    });
});

module.exports = router;