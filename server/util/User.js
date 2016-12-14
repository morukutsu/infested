/**
* project_infested server
* User.js - Network login and user management
*/

import BaseUser from '../../common/util/BaseUser';
import Socket from './util/Socket';

export default class User extends BaseUser {
    /**
    * Constructor
    */
    constructor() {
        super();

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
    }

    init() {
        var socket = this.socket;

        Socket.on(socket, 'ping', this.onPing.bind(this));

        //socket.on('action', console.log.bind(this));
    }

    onPing(data) {
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
    }

    /**
     * Perform cleanups on server when a user disconnects
     */
     destroy() {
        // Remove player entity from instance if any
        if (this.currentInstance !== null) {
            this.currentInstance.removeUser(this);
        }
    }
}
