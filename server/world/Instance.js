/**
 * project_infested server
 * Instance.js - Defines an World Instance
 *  An instance is a part of the global world defined by a map and some entities
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(

// Includes
[
    '../../common/entities/EntityManager',
    '../../common/util/Util'
],

function(EntityManager, Util) {
    /**
     * Constructor
     */
    var Instance = function() {
        /**
         * Entity Manager bound to the instance
         */
        this.entityManager = new EntityManager(null);

        /**
         * List of users on this instance
         */
        this.users = {};

        /**
         * Current sequence number of the generated snapshot
         */
        this.sequenceNo = 0;
    };

    Instance.prototype.update = function(dt) {
        this.entityManager.update(dt);

        // Generate instance snapshot
        var snapshot = this.snapshot();

        // Broadcast the snapshot to every user in the instance
        this.broadcast('snapshot', snapshot);
    };

    Instance.prototype.spawnPlayer = function(player) {
        // Attach the user to this instance
        this.users[player.user.username] = player.user;

        // Add the entity to our manager
        this.entityManager.add(player);
    };

    /**
     * Emit the same message to all the users on the current instance
     */
    Instance.prototype.broadcast = function(messageName, data) {
        var me = this;
        var users = this.users;

        Util.iterateMap(users, function(user) {
            var socket = user.socket;
            socket.emit(messageName, data);
        });
    };

    /**
     * Generates a full snapshot of the instance world
     */
    Instance.prototype.snapshot = function() {
        // Write snapshot
        var snapshot = {
            full: true,
            seq: this.sequenceNo,
            entities: this.entityManager.serialize()
        };

        // Increment sequence number for the next snapshot
        this.sequenceNo++;

        return snapshot;
    };

    return Instance;
});
