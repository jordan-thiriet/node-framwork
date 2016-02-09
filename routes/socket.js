module.exports = function (socket) {
    // send the new user their name and a list of users
    socket.on('send', function(data) {
        console.log('test');
        console.log(data);
    });
};