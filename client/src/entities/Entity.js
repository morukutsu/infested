/**
* project_infested client
* Entity.js - Basic game entity
*/

define('entities/Entity',

// Includes
['../components/ComponentManager'],

function(ComponentManager) {

    // Constructor
    var Entity = function() {
        this.componentManager = new ComponentManager();
        this.componentManager.parentEntity = this;

        this.position = new Phaser.Point(0, 0);
        this.parentManager = null;
    };

    // Init
    Entity.prototype.init = function() {
        this.componentManager.game = this.parentManager.game;
    };

    // Update
    Entity.prototype.update = function(dt) {
        this.componentManager.update(dt);
    };

    // Destroy
    Entity.prototype.destroy = function() {
        this.componentManager.clear();
    };

    return Entity;
});
