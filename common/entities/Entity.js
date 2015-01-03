/**
* project_infested common
* Entity.js - Basic game entity
*/

define(

// Includes
[
    '../components/ComponentManager',
    '../phaser/Point'
],

function(ComponentManager, Point) {

    // Constructor
    var Entity = function() {
        this.componentManager = new ComponentManager();
        this.componentManager.parentEntity = this;

        this.position = new Point(0, 0);
        this.parentManager = null;

        /**
         * Defines the type this entity (mandadory for world snapshots)
         */
        this.type = null;
    };

    // Init
    Entity.prototype.init = function() {
        this.game = this.parentManager.game;
        this.componentManager.game = this.game;
    };

    // Update
    Entity.prototype.update = function(dt) {
        this.componentManager.update(dt);
    };

    // Destroy
    Entity.prototype.destroy = function() {
        this.componentManager.clear();
    };

    // Utility function to retrieve the screen position of an entity
    Entity.prototype.getScreenPosition = function() {
        var game = this.game;
        var cam = game.camera;

        var screenX = this.position.x - cam.x;
        var screenY = this.position.y - cam.y;

        return new Point(screenX, screenY);
    }

    /**
     * Generates data used for world snapshots
     */
    Entity.prototype.serialize = function() {
        var data = {};

        data.type = this.type;
        data.x = this.position.x;
        data.y = this.position.y;

        return data;
    };

    return Entity;
});
