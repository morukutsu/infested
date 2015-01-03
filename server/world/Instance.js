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
    };

    Instance.prototype.update = function(dt) {
        this.entityManager.update(dt);
    };

    Instance.prototype.spawnPlayer = function(player) {
        // Attach the user to this instance
        this.users[player.user.username] = player.user;

        // Add the entity to our manager
        this.entityManager.add(player);

        // Broadcast spawn event to all users registered on this instance
        this.broadcast('spawn', {
            type: 'player',
            username: player.user.username,
            x: 0,
            y: 0,
        });
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

    return Instance;
});
