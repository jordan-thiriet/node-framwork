'use strict';

var colors = require('colors');
var prompt = require('prompt');
var oAuth = require('../model/oAuth.js');

var user = {};

user.create = function() {
    var schema = {
        properties: {
            Username: {
                description: 'Username',
                message: 'Username is require',
                required: true
            },
            Email: {
                description: 'Email',
                message: 'Invalid Email',
                pattern: /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/,
                required: true
            },
            Lastname: {
                description: 'Lastname',
                message: 'Lastname is require',
                required: true
            },
            Firstname: {
                description: 'Firstname',
                message: 'Firstname is require',
                required: true
            },
            Password: {
                description: 'Password',
                message: 'Password is require',
                hidden: true,
                required: true
            }
        }
    };
    prompt.get(schema, function (err, result) {
        oAuth.saveUser(result.Username, result.Password, result.Firstname, result.Lastname, result.Email, function() {
            console.log('Client Saved'.green);
            process.exit();
        });
    });
};

module.exports = user;