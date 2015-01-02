/**
* project_infested server
* app.js - Server entry point
*/
var http = require('http').createServer();
var io = require('socket.io')(http);
var server = require('./Server.js');
var requirejs = require('requirejs');

var players = {};

io.on('connection', function(socket) {
    console.log('[Connect] Incoming connection...');

    // Users login
    socket.on('login', function(data) {
        console.log('[Login] ' + data.username + ' logged in');
        socket.emit('login', {
            sucess: true
        });

        var player = {
            username: data.username,
            x: 0,
            y: 0
        };

        players[data.username] = player;
        socket.username = data.username;
    });

    // receive actions
    socket.on('action', function(data) {
        console.log(data);
    });
});


http.listen(3000, function(){
    console.log('listening on *:3000');
});

console.log(server);



requirejs.config({
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    nodeRequire: require
});

requirejs(['Server'],
function (Server) {
    //foo and bar are loaded according to requirejs
    //config, but if not found, then node's require
    //is used to load the module.
    var t = new Server();
});
