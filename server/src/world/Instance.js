/**
 * project_infested server
 * Instance.js - Defines an World Instance
 *  An instance is a part of the global world defined by a map and some entities
 */

import EntityManager from '../../common/entities/EntityManager';
import Util from '../../common/util/Util';
import Socket from './util/Socket';

export default class Instance {
    /**
     * Constructor
     */
    constructor() {
        /**
         * Entity Manager bound to the instance
         */
        this.entityManager = new EntityManager(null);

        /**
         * List of users on this instance
         */
        this.users = {};

        /**
         * Current ID to set to the next tracked entity
         */
        this.currentID = 0;

        /**
         * Current snapshot send timer in seconds
         */
        this.snapshotSendTimer = 0;

        /**
        * Snapshot send rate (in ms)
        */
        this.snapshotSendRate = 50; // 20 snapshots per second
    }

    update(dt) {
        this.entityManager.update(dt);

        // Generate instance snapshot
        if (this.snapshotSendTimer > this.snapshotSendRate / 1000.0) {
            var snapshot = this.snapshot();

            // Broadcast the snapshot to every user in the instance
            this.broadcast('snapshot', snapshot);

            this.snapshotSendTimer = 0;
        }

        this.snapshotSendTimer += dt;
    }

    spawnPlayer(player) {
        // Attach the user to this instance
        this.users[player.user.username] = player.user;
        player.user.currentInstance = this;

        // Add the entity to our manager
        player.id = this.currentID;
        this.currentID++;
        this.entityManager.add(player);

        // Keep track of the entity ID in the user class
        player.user.playerEntityID = player.id;
    }

    removeUser(user) {
        // Delete user from our list
        delete this.users[user.username];
        user.currentInstance = null;

        // Delete any linked player entity
        var foundEntity = this.entityManager.findById(user.playerEntityID);
        if (foundEntity) {
            this.entityManager.remove(foundEntity);
        }
    }

    /**
     * Emit the same message to all the users on the current instance
     */
    broadcast(messageName, data) {
        var me = this;
        var users = this.users;

        Util.iterateMap(users, function(user) {
            var socket = user.socket;

            // Append sequence number
            data.s = user.sequenceNo;

            // Send the packet to the user
            Socket.emit(socket, messageName, data);
        });
    }

    /**
     * Generates a full snapshot of the instance world
     */
    snapshot() {
        // Write snapshot
        var snapshot = {
            t: new Date().getTime(),
            full: true,
            entities: this.entityManager.serialize()
        };

        return snapshot;
    }
}
