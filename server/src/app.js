/**
* project_infested server
* app.js - Server entry point
*/

var http = require('http').createServer();
var io = require('socket.io')(http);

import Server from './Server';

var server = new Server(io);

// Open server listening socket
http.listen(3001, function(){
    console.log('## Server started on port 3001 ##');
});
