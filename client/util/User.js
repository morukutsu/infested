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

        /**
         * Handler for the ping timer
         */
        this.pingHandler = null;
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
        var me = this;
        var socket = this.socket;
        if (!socket) { return; }

        me.username = this.generateUsername('Player-');

        socket.emit('login', {
            username: me.username
        });

        socket.on('login', function(result) {
            // TODO: check login result

            // Setup event listeners
            me.setupPingTimer();
            socket.on('pong', me.onPong.bind(me));

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

    /**
     * Sets a ping timer to compute server latency
     */
    User.prototype.setupPingTimer = function() {
        this.pingHandler = setInterval(function() {
            var currentTime = new Date().getTime();
            this.socket.emit('ping', {
                t: currentTime
            });
        }.bind(this), 1000);
    };

    /**
     * Reads latency computed on the server
     */
    User.prototype.onPong = function(data) {
        this.latency = data.l;
    };

    return User;
});
