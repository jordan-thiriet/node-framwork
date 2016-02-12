var express = require('express');
var app = express();

var socket_io    = require( "socket.io" );
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var oauthserver = require('oauth2-server');
var mongoose = require('mongoose');

var config = require('./config.json');

//var routes = require('./routes/index');
var user = require('./routes/user');
var fitness = require('./routes/fitness');
var settings = require('./routes/settings');
var publicRoute = require('./routes/public');

var socket = require('./routes/socket');

var io = socket_io(config.socketPort);
app.io = io;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// Makes connection asynchronously. Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(config.mongoserver, function (err, res) {
    if (err) {
        console.log ('ERROR connecting to: ' + config.mongoserver + '. ' + err);
    } else {
        console.log ('Succeeded connected to: ' + config.mongoserver);
    }
});

app.oauth = oauthserver({
    model: require('./model/oAuth.js'),
    grants: ['password'],
    accessTokenLifetime: config.tokenLifetime,
    debug: true
});


app.all('/oauth/v2/token', app.oauth.grant());

//app.use('/', routes);

app.use('/api/user', app.oauth.authorise(), user);
app.use('/api/fitness', app.oauth.authorise(), fitness);
app.use('/api/settings', app.oauth.authorise(), settings);
app.use('/api/public', publicRoute);

io.on("connection", socket);

app.use(app.oauth.errorHandler());

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.send({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send({
        message: err.message,
        error: {}
    });
});


module.exports = app;
