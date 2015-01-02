/**
 * project_infested server
 * Server.js - Main server logic
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(

// Includes
[
    'util/User'
],

function(User) {
    /**
     * Constructor
     */
    var Server = function(io) {
        console.log("[Log] Server manager created!");

        /**
         * Hashmap of connected users
         */
        this.users = {};

        // Setup event listeners
        io.on('connection', this.onConnect.bind(this));
    };

    Server.prototype.onConnect = function(socket) {
        var me = this;
        console.log('[Connect] Incoming connection...');

        // Setup login event listener
        socket.on('login', this.onLogin.bind(this, socket));

        // receive actions
        /*socket.on('action', function(data) {
        console.log(data);
        });*/
    };

    Server.prototype.onLogin = function(socket, data) {
        var me = this;
        console.log('[Login] ' + data.username + ' logged in');
        socket.emit('login', {
            sucess: true
        });

        // Associate the socket <> username
        socket.username = data.username;

        // Create the user and store it in the server memory
        var user = new User();
        user.username = data.username;
        user.socket = socket;
        user.init();

        me.users[data.username] = user;
    };

    //Server.prototype.onPing = function()

    return Server;
});
