'use strict';

var colors = require('colors');
var crypto = require('crypto');
var oAuth = require('../model/oAuth.js');

var client = {};


client.create = function() {
    var clientid = null;
    var secret = null;

    // Create clientId
    crypto.randomBytes(20, function(ex, buf) {
        clientid = buf.toString('hex');
        // Create secret key
        crypto.randomBytes(36, function(ex, buf) {
            secret = buf.toString('hex');
            oAuth.saveClient(clientid, secret, function() {
                console.log('Client Id : '+clientid.green);
                console.log('Client Secret : '+secret.green);
                process.exit();
            });
        });
    });
};

module.exports = client;