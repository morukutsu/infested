/**
 * project_infested client
 * Instance.js - Defines a world instance locally
 */

define(

// Includes
[
    '../../common/entities/EntityManager',
    '../../common/util/Util',
    'map/Map'
],

function(EntityManager, Util, Map) {
    /**
     * Constructor
     */
    var Instance = function(game, user) {
        /**
         * Entity Manager bound to the instance
         */
        this.entityManager = new EntityManager(game);

        /**
         * List of users on this instance
         */
        this.users = {};

        /**
         * Current map
         */
        this.map = null;

        // Map creation
        var map = new Map(game);
        map.create(32, 32);
        this.map = map;

        /**
         * Current sequence number of the generated snapshot
         */
        this.sequenceNo = 0;

        // Setup event listeners
        this.user = user;

        this.user.socket.on('snapshot', this.onSnapshot.bind(this));
    };

    Instance.prototype.update = function(dt) {
        this.entityManager.update(dt);
    };

    /**
     * Function called when a new world snapshot is received from server
     */
    Instance.prototype.onSnapshot = function(snapshot) {

    };

    return Instance;
});
