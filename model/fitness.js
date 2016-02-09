var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    model = module.exports;

var FitnessSchema = new Schema({
    weight: {type: Number},
    fat: {type: Number},
    fluids: {type: Number},
    muscule: {type: Number},
    userid : {type: String},
    date: {type: Date, default: Date.now}
});

mongoose.model('Fitness', FitnessSchema);

var FitnessModel = mongoose.model('Fitness');

model.save = function(data, userid, callback) {
    var fitness = new FitnessModel({
        weight: data.weight,
        fat: data.fat,
        fluids: data.fluids,
        muscule: data.muscule,
        userid : userid,
        date: data.date
    });
    fitness.save(callback);
};

model.getAll = function(userid, callback) {
    FitnessModel.find({userid: userid},null, null, function (err, fitness) {
        if (err) return callback(err);
        return callback(null, fitness);
    });
};