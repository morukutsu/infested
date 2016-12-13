/**
* project_infested common
* ComponentManager.js - Update generic components
*/

export default class ComponentManager {
    // Constructor
    constructor() {
        this.components = [];
        this.game = null;
        this.parentEntity = null;
    }

    // Register a component to the manager
    add(component) {
        this.components.push(component);
        component.parentManager = this;
        component.parentEntity = this.parentEntity;
        component.init();
    }

    // Updates all components giving the delta time between the last tick
    update(dt) {
        var length = this.components.length;
        for (var i = 0; i < length; i++) {
            this.components[i].update(dt);
        }
    }

    // Destroy every component and clear all our references
    clear(dt) {
        var length = this.components.length;
        for (var i = 0; i < length; i++) {
            this.components[i].destroy();
        }
        this.components = [];
    }
}
