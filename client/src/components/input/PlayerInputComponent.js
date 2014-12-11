/**
* project_infested client
* PlayerInputComponent.js - Manages all player inputs
*/

define('components/input/PlayerInputComponent',

// Includes
['components/Component'],

function(Component) {

    // Constructor
    var PlayerInputComponent = function() {
        Component.call(this);
    };

    PlayerInputComponent.prototype = Object.create(Component.prototype);
    var _super_ = Component.prototype;

    // Init
    PlayerInputComponent.prototype.init = function() {
        _super_.init.call(this);
    };

    // Update
    PlayerInputComponent.prototype.update = function(dt) {
        _super_.update.call(this);

        // Read mouse input
        var game = this.parentManager.game;
        var input = game.input;
        var pointer = input.mousePointer;

        console.log("x: " + input.x + ", y: " + input.y);
    };

    // Destroy
    PlayerInputComponent.prototype.destroy = function() {
        _super_.destroy.call(this);
    };

    return PlayerInputComponent;
});
