/**
* project_infested common
* EntityManager.js - Update game entities
*/

define(

// Includes
[],

function() {

    // Constructor
    var EntityManager = function(game) {
        this.game = game;
        this.entities = [];
    };

    // Register a new entity
    EntityManager.prototype.add = function(entity) {
        this.entities.push(entity);
        entity.parentManager = this;
        entity.init();
    };

    // Updates all entities giving the delta time between the last tick
    EntityManager.prototype.update = function(dt) {
        var length = this.entities.length;
        for (var i = 0; i < length; i++) {
            this.entities[i].update(dt);
        }
    };

    // Removes the given entity reference
    EntityManager.prototype.remove = function(entity) {
        var length = this.entities.length;

        var position = -1
        for (var i = 0; i < length; i++) {
            if (this.entities[i] === entity) {
                entity.destroy();
                position = i;
                break;
            }
        }

        if (position >= 0) {
            this.entities.splice(position, 1);
        }
    };

    // Destroy every entity and clear all our references
    EntityManager.prototype.clear = function(dt) {
        var length = this.entities.length;
        for (var i = 0; i < length; i++) {
            this.entities[i].destroy();
        }
        this.entities = [];
    };

    /**
     * Serializes the entities
     */
    EntityManager.prototype.serialize = function() {
        var data = [];
        var length = this.entities.length;

        for (var i = 0; i < length; i++) {
            var entityData = this.entities[i].serialize();
            data.push(entityData);
        }

        return data;
    };

    /**
     * Find by ID
     */
    EntityManager.prototype.findById = function(id) {
        var length = this.entities.length;

        for (var i = 0; i < length; i++) {
            if (this.entities[i].id === id) {
                return this.entities[i];
            }
        }

        return null;
    };

    return EntityManager;
});
