var process = require('process');
var command = {
    options: []
};
process.argv.forEach(function(val, index, array) {
    if(index > 1) {
        if(val.substr(0,2) === '--') {
            command.options.push(val);
        } else if(val.indexOf('=') > -1) {
            var tmp = val.split('=');
            command[tmp[0]] = tmp[1];
        }
    }
});

module.exports = command;