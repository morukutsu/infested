/**
 * project_infested client
 * User.js - Network login and user management
 */

define(

// Includes
['socketio'],

function(io) {

    /**
     * Constructor
     */
    var User = function() {
        /**
         * the websocket obtained after the connect process
         */
        this.socket = null;
    };

    /**
     * Connect to the server
     */
    User.prototype.connect = function() {
        this.socket = io.connect('http://localhost:3000');
    };

    /**
     * Log in the server
     */
    User.prototype.login = function(callback) {
        var socket = this.socket;
        if (!socket) { return; }

        socket.emit('login', {
            username: this.generateUsername('Player-')
        });

        socket.on('login', function(result) {
            callback(result);
        });
    };

    /**
     * Generates a random username
     */
    User.prototype.generateUsername = function(base) {
        var numbers = [];
        var MAX_NUMBERS = 4;

        for (var i = 0; i < MAX_NUMBERS; i++) {
            var n = Math.floor((Math.random() * 9) + 1);
            numbers.push(n);
        }

        return base + numbers.join('');
    };

    return User;
});
