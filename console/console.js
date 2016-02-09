'use strict';

var process = require('process');
var mongoose = require('mongoose');

var uristring = 'mongodb://localhost/node-framwork';

// Makes connection asynchronously. Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, function (err, res) {
    if (err) {
        console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
        console.log ('Succeeded connected to: ' + uristring);
    }

    var user = require('./user.js');
    var client = require('./client.js');

    var mod = null;
    var fct = null;

    process.argv.forEach(function(val, index, array) {
        if(index > 1) {
            if(val.indexOf(':') > -1) {
                var tmp = val.split(':');
                mod = tmp[0];
                fct = tmp[1];
            }
        }
    });


    switch (mod) {
        case 'user':
            user[fct]();
            break;
        case 'client':
            client[fct]();
            break;
    }
});