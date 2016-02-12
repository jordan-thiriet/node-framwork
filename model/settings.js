var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    model = module.exports;

var SettingsSchema = new Schema({
    userid : {type: String}
},{ strict: false });

mongoose.model('Settings', SettingsSchema);

var SettingsModel = mongoose.model('Settings');

model.save = function(data, callback) {
    SettingsModel.update({userid: data.userid}, data, {upsert: true}, function (err) {
        if (err) return callback(err);
        return callback(null);
    });
};

model.get = function(userid, callback) {
    SettingsModel.findOne({userid: userid},null, null, function (err, settings) {
        if (err) return callback(err);
        return callback(null, settings);
    });
};