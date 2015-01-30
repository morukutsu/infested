/**
* project_infested client
* PlayerInputComponent.js - Manages all player inputs
*/

define(

// Includes
[
    '../../../common/components/Component',
    '../../../common/util/Util'
],

function(Component, Util) {

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
        _super_.update.call(this, dt);

        // Request all player actions for this frame
        this.parentEntity.playerActions = this.requestPlayerActions();
    };

    // Process player inputs and build a list of user actions
    PlayerInputComponent.prototype.requestPlayerActions = function () {
        var actions = [];

        var mouseActions = this.handleMouse();
        actions = actions.concat(mouseActions);

        return actions;
    };

    // Process mouse events
    PlayerInputComponent.prototype.handleMouse = function () {
        var mouseActions = [];
        var game = this.parentManager.game;
        var input = game.input;
        var mousePos = new Phaser.Point(input.x, input.y);

        // The player can be moved using the mouse a-la-Diablo like
        // The player moves along a displacement vector from the screen position
        // of the character to the point pointed by the mouse
        // TODO: normalize mouse coordinates for 2X scaled window
        var screenPosition = this.parentEntity.getScreenPosition();

        if (input.activePointer.isDown) {
            var action = {
                type: 'MoveCharacterTarget',
                network: true,
                targetX: mousePos.x + game.camera.x,
                targetY: mousePos.y + game.camera.y
            };
            mouseActions.push(action);

            console.log("********* down ************");
        }

        return mouseActions;
    };

    /**
     * Find an action in an action stack
     * @return integer index of the found element
     */
    PlayerInputComponent.prototype.findAction = function(type, stack) {
        for (var i = 0; i < stack.length; i++) {
            var action = stack[i];

            if (action.type === type) {
                return i;
            }
        }

        return -1;
    };

    // Destroy
    PlayerInputComponent.prototype.destroy = function() {
        _super_.destroy.call(this);
    };

    return PlayerInputComponent;
});
