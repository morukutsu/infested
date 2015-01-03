/**
* project_infested common
* MoveComponent.js - Process an action to move a parent entity
*/

define(

// Includes
[
    '../Component',
    '../../phaser/Point',
    '../../util/Util',
],

function(Component, Point, Util) {
    // Constructor
    var MoveComponent = function() {
        Component.call(this);
    };

    MoveComponent.prototype = Object.create(Component.prototype);
    var _super_ = Component.prototype;

    // Init
    MoveComponent.prototype.init = function() {
        _super_.init.call(this);

        /**
         * Internal state for the Mouse Movement
         */
        this.targetMovementState = {
            active: false,
            targetX: 0,
            targetY: 0
        };
    };

    // Update
    MoveComponent.prototype.update = function(dt) {
        _super_.update.call(this, dt);

        // Moves the component according to the registered player actions
        this.processPlayerActions(this.parentEntity.playerActions, dt);
    };

    // Process player actions
    MoveComponent.prototype.processPlayerActions = function (playerActions, dt) {
        var me = this;

        // Process actions which will eventually generate other actions
        playerActions.forEach(function(action) {
            switch(action.type) {
                case 'MoveCharacterTarget':
                    me.targetMovementState.active = true;
                    me.targetMovementState.targetX = action.targetX;
                    me.targetMovementState.targetY = action.targetY;
                    break;
            };
        });

        // Handle target movement
        this.handleTargetMovement(playerActions);

        // Process actions
        playerActions.forEach(function(action) {
            switch(action.type) {
                case 'MoveCharacter':
                    // Move character by given direction and speed
                    var speed = me.parentEntity.stats.speed * dt;
                    var direction = new Point(action.directionX, action.directionY);
                    var speedVector = new Point(speed, speed);
                    var displacement = Point.multiply(direction, speedVector);

                    me.parentEntity.position = Point.add(me.parentEntity.position, displacement);
                    break;
                case 'MoveCharacterTarget':
                    break;
                default:
                    console.error("Unhandled input action: " + action.type);
            }
        });
    };

    /**
     * Handles target movement
     */
    MoveComponent.prototype.handleTargetMovement = function(playerActions) {
        var oldTargetMovementState = Util.clone(this.targetMovementState);

        if (this.targetMovementState.active) {
            // Local actions
            var target = new Point(this.targetMovementState.targetX, this.targetMovementState.targetY);

            var direction = Point.subtract(target, this.parentEntity.position);

            // Move only if the player is not too close from the point on the map
            if (Point.distance(direction, new Point(0, 0)) > 2.0) {
                direction = Point.normalize(direction);

                var action = {
                    type: 'MoveCharacter', // TODO: change action codes to constants?
                    directionX: direction.x,
                    directionY: direction.y
                };

                playerActions.push(action);
            } else {
                this.targetMovementState.active = false;
            }
        }
    };

    // Destroy
    MoveComponent.prototype.destroy = function() {
        _super_.destroy.call(this);
    };

    return MoveComponent;
});
