/**
* project_infested server
* app.js - Server entry point
*/
var http = require('http').createServer();
var io = require('socket.io')(http);
var requirejs = require('requirejs');

// Create server manager instance
requirejs.config({
    nodeRequire: require
});

requirejs(['Server'],
function (Server) {
    var server = new Server(io);
});

// Open server listening socket
http.listen(3000, function(){
    console.log('listening on *:3000');
});
