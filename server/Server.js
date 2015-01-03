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
    'util/User',
    'world/Instance',
    'entities/player/Player'
],

function(User, Instance, Player) {
    /**
     * Constructor
     */
    var Server = function(io) {
        console.log("[Log] Server manager created!");

        /**
         * Hashmap of connected users
         */
        this.users = {};

        /**
         * World Instance
         */
        this.instance = new Instance();

        // Setup event listeners
        io.on('connection', this.onConnect.bind(this));
    };

    Server.prototype.onConnect = function(socket) {
        var me = this;
        console.log('[Connect] Incoming connection...');

        // Setup login event listener
        socket.on('login', this.onLogin.bind(this, socket));
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

        // TODO: move it to another place..
        // Spawn a player on the map for this user
        var player = new Player(user);
        this.instance.spawnPlayer(player);

        // Setup event listeners
        socket.on('disconnect', this.onDisconnect.bind(this, socket));
    };

    Server.prototype.onDisconnect = function(socket) {
        var username = socket.username;

        // Properly free resources from server
        var user = this.users[username];
        delete this.users[username];

        console.log("[Log] " + username + " disconnected!");
    };

    return Server;
});
