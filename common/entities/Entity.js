/**
* project_infested common
* Entity.js - Basic game entity
*/

import ComponentManager from '../components/ComponentManager';
import Point from '../phaser/Point';

export default class Entity {
    // Constructor
    constructor() {
        this.componentManager = new ComponentManager();
        this.componentManager.parentEntity = this;

        this.position = new Point(0, 0);
        this.parentManager = null;

        /**
         * Defines the type this entity (mandadory for world snapshots)
         */
        this.type = null;

        /**
         * Sets a short ID used to uniquely identify entityes within an instance
         */
        this.id = 0;

        /**
         * Defines if the entity is controlled by the client (needs position prediction)
         */
        this.userControlled = false;
    }

    // Init
    init() {
        this.game = this.parentManager.game;
        this.componentManager.game = this.game;
    }

    // Update
    update(dt) {
        this.componentManager.update(dt);
    }

    // Destroy
    destroy() {
        this.componentManager.clear();
    }

    // Utility function to retrieve the screen position of an entity
    getScreenPosition() {
        var game = this.game;
        var cam = game.camera;

        var screenX = this.position.x - cam.x;
        var screenY = this.position.y - cam.y;

        return new Point(screenX, screenY);
    }

    /**
     * Generates data used for world snapshots
     */
    serialize() {
        var data = {};

        data.id = this.id;
        data.type = this.type;
        data.x = this.position.x;
        data.y = this.position.y;

        return data;
    }
}
