/**
 * project_infested client
 * Factory.js - Entity factory
 */

define(

// Includes
[
    'entities/player/Player',
],

function(Player) {
    var Factory = function() {};

    /**
     * Creates an entity based on a type and some parameters
     */
    Factory.createEntity = function(type, params) {
        var entity;

        switch (type) {
            // Player entity
            case 'player':
                entity = new Player(params.socket, params.userControlled, params.isInputPrediction);
                break;
        }

        // Append world related data
        entity.id = params.id;
        entity.position.x = params.x;
        entity.position.y = params.y;

        return entity;
    };

    return Factory;
});
