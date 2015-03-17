/**
* project_infested server
* Socket.js - Socket additional functions & wrappers
*/
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(

// Includes
[],

function() {
    var Socket = function() {
    };

    /**
     * Server fake latency in ms
     */
    var fakeLag = 0;

    /**
     * Server emit function wrapper, handle fake latency management
     */
    Socket.emit = function(socket, command, data) {
        // Send packet
        if (fakeLag === 0) {
            socket.emit(command, data);
        } else {
            setTimeout(function() {
                socket.emit(command, data);
            }, fakeLag);
        }
    };

    /**
     * Server on funciton wrapper, handle fake latency management
     */
    Socket.on = function(socket, command, callback) {
        if (fakeLag === 0) {
            socket.on(command, callback);
        } else {
            socket.on(command, function(data) {
                setTimeout(function() {
                    callback(data);
                }, fakeLag);
            }.bind(socket));
        }
    };

    return Socket;
});
