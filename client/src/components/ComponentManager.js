/**
* project_infested client
* ComponentManager.js - Update generic components
*/

define('components/ComponentManager', [], function() {
    // Constructor
    var ComponentManager = function() {
        this.components = [];
        this.game = null;
        this.parentEntity = null;
    };

    // Register a component to the manager
    ComponentManager.prototype.add = function(component) {
        this.components.push(component);
        component.parentManager = this;
        component.parentEntity = this.parentEntity;
        component.init();
    };

    // Updates all components giving the delta time between the last tick
    ComponentManager.prototype.update = function(dt) {
        var length = this.components.length;
        for (var i = 0; i < length; i++) {
            this.components[i].update(dt);
        }
    };

    // Destroy every component and clear all our references
    ComponentManager.prototype.clear = function(dt) {
        var length = this.components.length;
        for (var i = 0; i < length; i++) {
            this.components[i].destroy();
        }
        this.components = [];
    };

    return ComponentManager;
});
