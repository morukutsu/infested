/**
* project_infested client
* EntityManager.js - Update game entities
*/

define('entities/EntityManager', [], function() {

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

    // Destroy every entity and clear all our references
    EntityManager.prototype.clear = function(dt) {
        var length = this.entities.length;
        for (var i = 0; i < length; i++) {
            this.entities[i].destroy();
        }
        this.entities = [];
    };

    return EntityManager;
});
