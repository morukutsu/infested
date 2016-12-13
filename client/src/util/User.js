/**
 * project_infested client
 * User.js - Network login and user management
 */

import io from 'socket.io';
import BaseUser from '../common/util/BaseUser';

export default class User extends BaseUser {
    constructor(isOfflineMode) {
        super();

        /**
         * Handler for the ping timer
         */
        this.pingHandler = null;

        /**
        * Current ID of the Player entity
        */
        this.playerEntityID = -1;

        /**
         * Current latency of the user
         */
        this.latency = 0;

        /**
         * Connection status of the user
         */
        this.isConnected = false;

        /**
         * Force offline mode
         */
        this.isOfflineMode = isOfflineMode;
    }

    /**
     * Connect to the server
     */
    connect() {
        this.socket = null;

        if (!this.isOfflineMode) {
            this.socket = io.connect('http://localhost:3000');
        }
    }

    /**
     * Log in the server
     */
    login(callback) {
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
    }

    /**
     * Generates a random username
     */
    generateUsername(base) {
        var numbers = [];
        var MAX_NUMBERS = 4;

        for (var i = 0; i < MAX_NUMBERS; i++) {
            var n = Math.floor((Math.random() * 9) + 1);
            numbers.push(n);
        }

        return base + numbers.join('');
    }

    /**
     * Sets a ping timer to compute server latency
     */
    setupPingTimer() {
        this.pingHandler = setInterval(function() {
            var currentTime = new Date().getTime();
            this.socket.emit('ping', {
                t: currentTime
            });
        }.bind(this), 1000);
    }

    /**
     * Reads latency computed on the server
     */
    onPong() {
        this.latency = data.l;
    }
}
