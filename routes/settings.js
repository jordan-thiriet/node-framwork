var express = require('express');
var oAuth = require('../model/oAuth.js');
var settings = require('../model/settings.js');
var router = express.Router();

router.get('/',function (req, res, next) {
    var matches = req.get('Authorization').match(/Bearer\s(\S+)/);
    var token = matches[1];
    oAuth.getUserFromToken(token,function(err, data) {
        if(err) {
            res.status(400).send({error: err});
        } else {
            settings.get(data.userId._id, function(err, setting) {
                if(err) {
                    res.status(400).send({error: err});
                } else {
                    res.status(200).send(setting);
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
            req.body.userid = data.userId._id;
            settings.save(req.body, function(err) {
                if(err) {
                    res.status(500).send({error: err});
                } else {
                    res.status(200).send();
                }
            });
        }
    });
});

module.exports = router;