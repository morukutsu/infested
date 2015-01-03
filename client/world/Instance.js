/**
 * project_infested client
 * Instance.js - Defines a world instance locally
 */

define(

// Includes
[
    '../../common/entities/EntityManager',
    '../../common/util/Util',
    'map/Map',
    'entities/player/Player'
],

function(EntityManager, Util, Map, Player) {
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
        var me = this;

        // Check if there are new entities to spawn
        snapshot.entities.forEach(function(entity) {
            var foundEntity = me.entityManager.findById(entity.id);
            if (!foundEntity) {
                // We have to spawn a new entity to the world
                if (entity.type === 'player') {
                    var userControlled = entity.username === me.user.username;
                    var player = new Player(me.user.socket, userControlled);
                    player.id = entity.id;
                    me.entityManager.add(player);
                }
            }
        });
    };

    return Instance;
});
