/**
 * project_infested client
 * User.js - Network login and user management
 */

define(

// Includes
[
    'socketio',
    '../../common/util/BaseUser'
],

function(io, BaseUser) {

    /**
     * Constructor
     */
    var User = function() {
        BaseUser.call(this);
    };

    User.prototype = Object.create(BaseUser.prototype);
    var _super_ = BaseUser.prototype;

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
