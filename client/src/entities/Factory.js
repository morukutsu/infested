/**
 * project_infested client
 * Factory.js - Entity factory
 */

import Player from './player/Player';

const Factory = {
    /**
     * Creates an entity based on a type and some parameters
     */
    createEntity(type, params) {
        var entity;

        switch (type) {
            // Player entity
            case 'player':
                entity = new Player(params.socket, params.userControlled, params.isInputPrediction);
                break;
            default:
                break;
        }

        // Append world related data
        entity.id = params.id;
        entity.position.x = params.x;
        entity.position.y = params.y;

        return entity;
    }
};

export default Factory;
