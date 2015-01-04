/**
* project_infested server
* User.js - Network login and user management
*/

define(

// Includes
[
    '../../common/util/BaseUser',
    'util/Socket',
],

function(BaseUser, Socket) {

    /**
    * Constructor
    */
    var User = function() {
        BaseUser.call(this);

        /**
         * Current socket attached to the user
         */
        this.socket = null;

        /**
         * Current instance of the User Player
         */
        this.currentInstance = null;

        /**
         * Current ID of the Player entity
         */
        this.playerEntityID = -1;
    };

    User.prototype = Object.create(BaseUser.prototype);
    var _super_ = BaseUser.prototype;

    User.prototype.init = function() {
        var socket = this.socket;

        Socket.on(socket, 'ping', this.onPing.bind(this));

        //socket.on('action', console.log.bind(this));
    };

    User.prototype.onPing = function(data) {
        var currentTime = new Date().getTime();
        var latency = currentTime - data.t;

        // Correct latency computation when the server and client are running
        // on the same machine
        if (latency < 0) {
            latency = 0;
        }

        Socket.emit(this.socket, 'pong', {
            l: latency
        });
    };

    /**
     * Perform cleanups on server when a user disconnects
     */
    User.prototype.destroy = function() {
        // Remove player entity from instance if any
        if (this.currentInstance !== null) {
            this.currentInstance.removeUser(this);
        }
    };

    return User;
});
