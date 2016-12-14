/**
 * project_infested client
 * Instance.js - Defines a world instance locally
 */

import EntityManager from '../common/entities/EntityManager';
import Util from '../common/util/Util';
import Map from '../map/Map';
import Player from '../entities/player/Player';
import Factory from '../entities/Factory';
import PhaserMath from '../common/phaser/Math';

export default class Instance {
    /**
     * Constructor
     */
    constructor(game, user) {
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
        this.isInputPrediction = true;

        /**
         * Last ackowledged sequence number by the server
         */
        this.lastAckSequenceNumber = 0;

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
    }

    update(dt) {
        // Process buffered snapshots
        this.processSnapshots(dt);

        // Update the entities
        this.entityManager.update(dt);
    }

    /**
     * Function called when a new world snapshot is received from server
     */
    onSnapshot(snapshot) {
        var me = this;

        // Store the received snapshot
        this.snapshots.push(snapshot);

        // Compute server times
        this.serverTime = snapshot.t;
        this.correctedServerTime = this.serverTime;

        this.clientTime = this.serverTime - this.netOffset;
        this.interpolationClientTime = this.clientTime - 16;

        // Remove last processed snapshots if the buffer is full
        if (this.snapshots.length > this.snapshotsBufferLength) {
            this.snapshots.shift();
        }

        // Save the last ACKed sequence number
        this.lastAckSequenceNumber = snapshot.s;
    }

    /**
     * Process buffered snapshots
     */
    processSnapshots(dt) {
        // Discard if there are not enough snapshots to process
        if (this.snapshots.length === 0) {
            return;
        }

        // Find the two snapshots to interpolate
        var currentTime = this.clientTime;
        var from = null;
        var to = null;

        // TODO: optimization, going backward in this loop will be faster
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

        // Correct client time / server time every frame
        this.interpolationClientTime += Math.floor(dt * 1000);
        this.correctedServerTime     += Math.floor(dt * 1000);
    }

    /**
     * Spawn new entities from a snapshot to process
     */
    spawnEntities(snapshot) {
        var me = this;

        // Check if there are new entities to spawn
        Util.iterateMap(snapshot.entities, function(entity) {
            var foundEntity = me.entityManager.findById(entity.id);

            // Test if we have to spawn a new entity to the world
            if (!foundEntity) {

                // PLAYER
                if (entity.type === 'player') {
                    var userControlled = entity.username === me.user.username;

                    var parameters = {
                        id: entity.id,
                        x: entity.x,
                        y: entity.y,
                        socket: me.user.socket,
                        userControlled: userControlled,
                        isInputPrediction: me.isInputPrediction
                    };

                    var player = Factory.createEntity('player', parameters);
                    me.entityManager.add(player);

                    // Keep track of the entity ID in the user class
                    if (userControlled) {
                        me.user.playerEntityID = player.id;
                    }
                }
            }
        });
    }

    /**
     * Performs input prediction correction
     */
    predictionCorrection(snapshot) {
        var me = this;

        Util.iterateMap(snapshot.entities, function(entity) {
            var foundEntity = me.entityManager.findById(entity.id);
            if (foundEntity && foundEntity.userControlled) {
                foundEntity.position.x = entity.x;
                foundEntity.position.y = entity.y;
            }
        });
    }

    /**
     * Interpolate positions of the Instance entities with two snapshots
     */
    interpolatePositions(from, to) {
        var me = this;

        // Setup lerp time
        var elapsed = to.t - from.t;
        var clientTime = Math.min(this.interpolationClientTime, to.t);
        var t = (to.t - clientTime) / elapsed;
        t = 1 - t;

        //console.log(from.t, to.t, clientTime);

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
                var x = PhaserMath.linear(entityFrom.x, entityTo.x, t);
                var y = PhaserMath.linear(entityFrom.y, entityTo.y, t);

                // Find the entity in our entity manager
                // TODO: optimize fhe find by ID
                var foundEntity = me.entityManager.findById(entityFrom.id);
                if (foundEntity) {
                    foundEntity.position.x = x;
                    foundEntity.position.y = y;
                }
            }
        });
    }
}
