/**
* project_infested server
* User.js - Network login and user management
*/

define(

// Includes
[
    '../../common/util/BaseUser'
],

function(BaseUser) {

    /**
    * Constructor
    */
    var User = function() {
        BaseUser.call(this);
    };

    User.prototype = Object.create(BaseUser.prototype);
    var _super_ = BaseUser.prototype;

    User.prototype.init = function() {
        var socket = this.socket;

        socket.on('ping', this.onPing.bind(this));

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

        this.socket.emit('pong', {
            l: latency
        });
    };

    return User;
});
