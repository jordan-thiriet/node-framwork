/**
 * Copyright 2013-present NightWorld.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var passwordHash = require('password-hash');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    model = module.exports;

//
// Schemas definitions
//
var OAuthAccessTokensSchema = new Schema({
    accessToken: {type: String},
    clientId: {type: String},
    userId: {type: String, ref: 'OAuthUsers'},
    expires: {type: Date}
});

var OAuthRefreshTokensSchema = new Schema({
    refreshToken: {type: String},
    clientId: {type: String},
    userId: {type: String},
    expires: {type: Date}
});

var OAuthClientsSchema = new Schema({
    clientId: {type: String},
    clientSecret: {type: String},
    redirectUri: {type: String, default: ''}
});

var OAuthUsersSchema = new Schema({
    username: {type: String},
    password: {type: String},
    firstname: {type: String},
    lastname: {type: String},
    email: {type: String, default: ''}
});

mongoose.model('OAuthAccessTokens', OAuthAccessTokensSchema);
mongoose.model('OAuthRefreshTokens', OAuthRefreshTokensSchema);
mongoose.model('OAuthClients', OAuthClientsSchema);
mongoose.model('OAuthUsers', OAuthUsersSchema);

var OAuthAccessTokensModel = mongoose.model('OAuthAccessTokens'),
    OAuthRefreshTokensModel = mongoose.model('OAuthRefreshTokens'),
    OAuthClientsModel = mongoose.model('OAuthClients'),
    OAuthUsersModel = mongoose.model('OAuthUsers');

//
// oauth2-server callbacks
//
model.getAccessToken = function (bearerToken, callback) {
    OAuthAccessTokensModel.findOne({accessToken: bearerToken}, callback);
};

model.getUserFromToken = function (bearerToken, callback) {
    OAuthAccessTokensModel.findOne({accessToken: bearerToken}).populate('userId').exec(callback);
};

model.getClient = function (clientId, clientSecret, callback) {
    if (clientSecret === null) {
        return OAuthClientsModel.findOne({clientId: clientId}, callback);
    }
    OAuthClientsModel.findOne({clientId: clientId, clientSecret: clientSecret}, callback);
};

// This will very much depend on your setup, I wouldn't advise doing anything exactly like this but
// it gives an example of how to use the method to resrict certain grant types
model.grantTypeAllowed = function (clientId, grantType, callback) {
    /*if (grantType === 'password') {
        return callback(false, authorizedClientIds.indexOf(clientId) >= 0);
    }*/

    callback(false, true);
};

model.saveAccessToken = function (token, clientId, expires, userId, callback) {
    var accessToken = new OAuthAccessTokensModel({
        accessToken: token,
        clientId: clientId,
        userId: userId,
        expires: expires
    });

    accessToken.save(callback);
};

model.saveClient = function(clientId, clientSecret, callback) {
    var client = new OAuthClientsModel({
        clientId: clientId,
        clientSecret: clientSecret
    });

    client.save(callback);
};

model.saveUser = function (username, password, firstname, lastname, email, callback) {
    password = passwordHash.generate(password);

    var user = new OAuthUsersModel({
        username: username,
        password: password,
        firstname: firstname,
        lastname: lastname,
        email: email
    });
    user.save(callback);
};

/*
 * Required to support password grant type
 */
model.getUser = function (username, password, callback) {
    OAuthUsersModel.findOne({username: username},null, null, function (err, user) {
        if (err || !user) return callback(err, user);
        if(!passwordHash.verify(password, user.password)) {
            return callback(err, null);
        } else {
            return callback(null, user);
        }
    });
};

/*
 * Required to support password grant type
 */
model.getUserById = function (id, callback) {
    OAuthUsersModel.findOne({_id: id},null, null, function (err, user) {
        if (err || !user) return callback(err, user);
        return callback(null, user);
    });
};

/*
 * Update user
 */
model.update = function (id, query, callback) {
    OAuthUsersModel.update({_id: id}, query, null, function(err, user) {
        if (err || !user) return callback(err, user);
        return callback(null);
    });
};

/*
 * Update user
 */
model.updateUser = function (id, userUpdate, callback) {
    var query = {
        username: userUpdate.username,
        firstname: userUpdate.firstname,
        lastname: userUpdate.lastname,
        email: userUpdate.email
    };
    return model.update(id, query, callback);
};

/*
 * Update password
 */
model.updatePassword = function (id, newPwd, callback) {
    var query = {password: passwordHash.generate(newPwd)};
    return model.update(id, query, callback);
};

/*
 * Required to support refreshToken grant type
 */
model.saveRefreshToken = function (token, clientId, expires, userId, callback) {
    var refreshToken = new OAuthRefreshTokensModel({
        refreshToken: token,
        clientId: clientId,
        userId: userId,
        expires: expires
    });

    refreshToken.save(callback);
};

model.getRefreshToken = function (refreshToken, callback) {
    OAuthRefreshTokensModel.findOne({refreshToken: refreshToken}, callback);
};
