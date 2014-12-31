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

        // Internal state for the Mouse Movement
        this.mouseMovementState = {
            active: false,
            targetX: 0,
            targetY: 0
        };
    };

    // Update
    PlayerInputComponent.prototype.update = function(dt) {
        _super_.update.call(this);

        var playerActions = this.requestPlayerActions();
        this.processPlayerActions(playerActions);
    };

    // Process player actions
    PlayerInputComponent.prototype.processPlayerActions = function (playerActions) {
        var me = this;
        playerActions.forEach(function(action) {
            switch(action.type) {
                case 'MoveCharacter':
                    // Move character by given direction and speed
                    var speed = me.parentEntity.stats.speed;
                    var direction = new Phaser.Point(action.directionX, action.directionY);
                    var speedVector = new Phaser.Point(speed, speed);
                    var displacement = Phaser.Point.multiply(direction, speedVector);

                    me.parentEntity.position = Phaser.Point.add(me.parentEntity.position, displacement);
                    break;
                default:
                    console.error("Unhandled input action: " + action.type);
            };
        });
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
            this.mouseMovementState.active = true;
            this.mouseMovementState.targetX = mousePos.x + game.camera.x;
            this.mouseMovementState.targetY = mousePos.y + game.camera.y;
        }

        if (this.mouseMovementState.active) {
            var target = new Phaser.Point(this.mouseMovementState.targetX,
                                          this.mouseMovementState.targetY);

            var direction = Phaser.Point.subtract(target,
                this.parentEntity.position);

            // Move only if the player is not too close from the point on the map
            if (Phaser.Point.distance(direction, new Phaser.Point(0, 0)) > 2.0) {
                direction = Phaser.Point.normalize(direction);

                var action = {
                    type: 'MoveCharacter', // TODO: change action codes to constants?
                    directionX: direction.x,
                    directionY: direction.y
                };

                mouseActions.push(action);
            } else {
                this.mouseMovementState.active = false;
            }
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
