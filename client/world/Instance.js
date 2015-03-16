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
    'entities/player/Player',
    '../../common/phaser/Math'
],

function(EntityManager, Util, Map, Player, PhaserMath) {
    /**
     * Constructor
     */
    var Instance = function(game, user) {
        /**
         * Entity Manager bound to the instance
         */
        this.entityManager = new EntityManager(game);
        this.entityManager.parentInstance = this;

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
         * Current sequence number of the last processed snapshot
         */
        this.lastSequenceNo = 0;

        /**
         * Current server time
         */
        this.serverTime = 0;

        /**
         * Server time + the elapsed ms since the last acknowledged server time
         */
        this.correctedServerTime = 0;

        /**
         * Current client time
         */
        this.clientTime = 0;

        /**
         * Client time + the elapsed ms since the last acknowledged client time
         */
        this.interpolationClientTime = 0;

        /**
         * Time offset to interpolate other users correctly
         */
        this.netOffset = 100;

        /**
         * Maximum length of the snapshots buffer
         */
        this.snapshotsBufferLength = 32;

        /**
         * Snapshot buffer
         */
        this.snapshots = [];

        /**
         * Enables the input prediction
         */
        this.isInputPrediction = false;

        // Setup event listeners in online mode
        this.user = user;

        if (this.user.socket) {
            this.user.socket.on('snapshot', this.onSnapshot.bind(this));
        }


        // Directly instantiate a Player entity in offline mode
        // TODO: parse map files and create entities from there
        if (this.user.isOfflineMode) {
            var userControlled = true;
            var player = new Player(this.user.socket, userControlled);
            player.id = 0;
            this.entityManager.add(player);

            player.position.x = 0;
            player.position.y = 0;

            // Keep track of the entity ID in the user class
            if (userControlled) {
                this.user.playerEntityID = player.id;
            }

        }
    };

    Instance.prototype.update = function(dt) {
        // Process buffered snapshots
        this.processSnapshots(dt);

        // Update the entities
        this.entityManager.update(dt);
    };

    /**
     * Function called when a new world snapshot is received from server
     */
    Instance.prototype.onSnapshot = function(snapshot) {
        var me = this;

        // Store the received snapshot
        this.snapshots.push(snapshot);

        // Compute server times
        this.serverTime = snapshot.t;
        this.correctedServerTime = this.serverTime;

        this.clientTime = this.serverTime - this.netOffset;
        this.interpolationClientTime = this.clientTime;

        // Remove last processed snapshots if the buffer is full
        if (this.snapshots.length > this.snapshotsBufferLength) {
            this.snapshots.shift();
        }
    };

    /**
     * Process buffered snapshots
     */
    Instance.prototype.processSnapshots = function(dt) {
        // Discard if there are not enough snapshots to process
        if (this.snapshots.length === 0) {
            return;
        }

        // Find the two snapshots to interpolate
        var currentTime = this.clientTime;
        var from = null;
        var to = null;

        for (var i = 0; i < this.snapshots.length - 1; i++) {
            var prev = this.snapshots[i];
            var next = this.snapshots[i + 1];

            if (currentTime > prev.t && currentTime < next.t) {
                from = prev;
                to = next;
                break;
            }
        }

        // Setup the reference snapshot
        var reference = this.snapshots[0];
        if (to !== null) {
            reference = to;
        }

        // Spawn new entities from the reference snapshot
        // TODO: eventually, process the snapshots before if some snapshots are skipped?
        this.spawnEntities(reference);

        // Perform input prediction correction
        var latest = this.snapshots[this.snapshots.length - 1];
        if (this.isInputPrediction) {
            this.predictionCorrection(latest);
        }
        
        // Interpolate entities positions
        if (to !== null && from !== null) {
            this.interpolatePositions(from, to);
        }

        // Register last processed snapshot
        this.lastProcessedSnapshot = reference.seq;

        // Correct client time / server time every frame
        this.interpolationClientTime += Math.floor(dt * 1000);
        this.correctedServerTime     += Math.floor(dt * 1000);
    };

    /**
     * Spawn new entities from a snapshot to process
     */
    Instance.prototype.spawnEntities = function(snapshot) {
        var me = this;

        // Check if there are new entities to spawn
        Util.iterateMap(snapshot.entities, function(entity) {
            var foundEntity = me.entityManager.findById(entity.id);
            if (!foundEntity) {
                // We have to spawn a new entity to the world
                if (entity.type === 'player') {
                    var userControlled = entity.username === me.user.username;
                    var player = new Player(me.user.socket, userControlled);
                    player.id = entity.id;
                    me.entityManager.add(player);

                    player.position.x = entity.x;
                    player.position.y = entity.y;

                    // Keep track of the entity ID in the user class
                    if (userControlled) {
                        me.user.playerEntityID = player.id;
                    }
                }
            }
        });
    };

    /**
     * Performs input prediction correction
     */
    Instance.prototype.predictionCorrection = function(snapshot) {
        var me = this;

        if (snapshot.seq > this.lastSequenceNo) {
            Util.iterateMap(snapshot.entities, function(entity) {
                var foundEntity = me.entityManager.findById(entity.id);
                if (foundEntity && foundEntity.userControlled) {
                    foundEntity.position.x = entity.x;
                    foundEntity.position.y = entity.y;
                }
            });
            this.lastSequenceNo = snapshot.seq;
        }
    };

    /**
     * Interpolate positions of the Instance entities with two snapshots
     */
    Instance.prototype.interpolatePositions = function(from, to) {
        var me = this;

        // Setup lerp time
        var elapsed = to.t - from.t;
        var clientTime = this.interpolationClientTime < to.t? this.interpolationClientTime : to.t;
        var t = (to.t - clientTime) / elapsed;
        t = 1 - t;

        // Find entities that can be interpolated
        Util.iterateMap(from.entities, function(entityFrom) {
            // Skip the user controlled entities. If the prediction is deactivated (for debug)
            // we need to get the position from the server
            if (me.isInputPrediction) {
                if (entityFrom.id === me.user.playerEntityID ||
                    me.entityManager.findById(entityFrom.id).userControlled)
                {
                    return;
                }
            }

            // Interpolate
            var entityTo = to.entities[entityFrom.id];
            if (entityTo) {
                // The entity can be interpolated, interpolate position
                var x = PhaserMath.interpolateFloat(entityFrom.x, entityTo.x, t);
                var y = PhaserMath.interpolateFloat(entityFrom.y, entityTo.y, t);

                // Find the entity in our entity manager
                // TODO: optimize fhe find by ID
                var foundEntity = me.entityManager.findById(entityFrom.id);
                if (foundEntity) {
                    foundEntity.position.x = x;
                    foundEntity.position.y = y;
                }
            }
        });
    };

    return Instance;
});
