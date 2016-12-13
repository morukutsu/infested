/**
* project_infested common
* EntityManager.js - Update game entities
*/

export default class EntityManager {
    // Constructor
    constructor(game) {
        this.game = game;
        this.entities = [];
    }

    // Register a new entity
    add(entity) {
        this.entities.push(entity);
        entity.parentManager = this;
        entity.init();
    }

    // Updates all entities giving the delta time between the last tick
    update(dt) {
        var length = this.entities.length;
        for (var i = 0; i < length; i++) {
            this.entities[i].update(dt);
        }
    }

    // Removes the given entity reference
    remove(entity) {
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
    }

    // Destroy every entity and clear all our references
    clear(dt) {
        var length = this.entities.length;
        for (var i = 0; i < length; i++) {
            this.entities[i].destroy();
        }
        this.entities = [];
    }

    /**
     * Serializes the entities
     */
    serialize() {
        var data = {};
        var length = this.entities.length;

        for (var i = 0; i < length; i++) {
            var entityData = this.entities[i].serialize();
            var id = this.entities[i].id;
            data[id] = entityData;
        }

        return data;
    }

    /**
     * Find by ID
     */
    findById(id) {
        var length = this.entities.length;

        for (var i = 0; i < length; i++) {
            if (this.entities[i].id === id) {
                return this.entities[i];
            }
        }

        return null;
    }
}
