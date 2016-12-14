/**
 * project_infested server
 * Server.js - Main server logic
 */

var NanoTimer = require('nanotimer');

import User from './util/User';
import Instance from './world/Instance';
import Player from './entities/player/Player';
import Socket from './util/Socket';

export default class Server {
    /**
     * Constructor
     */
    constructor(io) {
        console.log("[Log] Server manager created!");

        /**
         * Hashmap of connected users
         */
        this.users = {};

        /**
         * World Instance
         */
        this.instance = new Instance();

        /**
         * Server rate: main update rate for physics (in ms)
         */
        this.serverRate = 16; // 60 fps physics

        // Setup event listeners
        io.on('connection', this.onConnect.bind(this));

        // Run main update loop
        this.setupUpdateTimer();
    }

    onConnect(socket) {
        var me = this;
        console.log('[Connect] Incoming connection...');

        // Setup login event listener
        Socket.on(socket, 'login', this.onLogin.bind(this, socket));
    }

    onLogin(socket, data) {
        var me = this;
        console.log('[Login] ' + data.username + ' logged in');
        Socket.emit(socket, 'login', {
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
    }

    onDisconnect(socket) {
        var username = socket.username;

        // Properly free resources from server
        var user = this.users[username];
        user.destroy();
        delete this.users[username];

        console.log("[Log] " + username + " disconnected!");
    }

    /**
     * Updates the World State
     */
    update(dt) {
        this.instance.update(dt);
    }

    /**
     * Setup update caller
     */
    setupUpdateTimer() {
        // Set initial old date to the current date
        this.oldTime = new Date().getTime();

        // Run update function every serverRate ms
        var rate = '' + this.serverRate + 'm';
        timer = new NanoTimer();
        this.updateTimerHandler = timer.setInterval(function() {
            // Compute real delta time before previous update
            var dt = new Date().getTime() - this.oldTime;
            this.oldTime = new Date().getTime();

            // Check if the server is keeping up with its target update rate
            //if (dt > this.serverRate) {
            //    console.log("[Warning] Server slowdown ( " + dt + " ms)");
            //}

            // Update physics at a constant rate of serverRate
            var dtSec = this.serverRate / 1000.0;
            this.update(dtSec);
        }.bind(this), '', rate);
    }
}
