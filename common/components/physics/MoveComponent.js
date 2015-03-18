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
    var MoveComponent = function(isInputPrediction) {
        Component.call(this);

        /**
         * Defines if the input prediction will be activated
         */
        this.isInputPrediction = isInputPrediction;
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

        /**
         * Buffer for input prediction correction
         */
        this.inputCorrectionBuffer = [];

        /**
         * Size of the input correction buffer
         * Must have enough size to store inputs for high ping scenarios
         */
        this.inputCorrectionBufferSize = 32;
    };

    // Update
    MoveComponent.prototype.update = function(dt) {
        _super_.update.call(this, dt);

        // Apply input prediction
        // This will add a set of new actions in the action stack
        if (this.isInputPrediction) {
            this.inputPrediction(this.parentEntity.playerActions);
        }

        // Moves the component according to the registered player actions
        this.processPlayerActions(this.parentEntity.playerActions, dt);
    };

    // Process player actions
    MoveComponent.prototype.processPlayerActions = function (playerActions, dt) {
        var me = this;

        // Process actions which will eventually generate other actions
        /*playerActions.forEach(function(action) {
            switch(action.type) {
                case 'MoveCharacterTarget':
                    me.targetMovementState.active = true;
                    me.targetMovementState.targetX = action.targetX;
                    me.targetMovementState.targetY = action.targetY;
                    break;
            }
        });*/

        // Handle target movement
        //this.handleTargetMovement(playerActions);

        // Process actions
        playerActions.forEach(function(action) {
            if (this.isInputPrediction && action.network) {
                return;
            }

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

                // Push actions to the input correction buffer
                if (this.isInputPrediction) {
                    var newAction = Util.clone(action);

                    // Set the corrected server time to the action
                    var instance = this.parentEntity.parentManager.parentInstance;
                    newAction.t = instance.correctedServerTime;

                    this.inputCorrectionBuffer.push(newAction);
                    if (this.inputCorrectionBuffer.length > this.inputCorrectionBufferSize) {
                        this.inputCorrectionBuffer.shift();
                    }
                } else {
                    playerActions.push(action);
                }
            } else {
                this.targetMovementState.active = false;

                // Remove any left move character action from the stack
                var toDelete = [];
                for (var i = 0; i < this.inputCorrectionBuffer.length; i++) {
                    if (this.inputCorrectionBuffer[i].type === 'MoveCharacter') {
                        toDelete.push(this.inputCorrectionBuffer[i]);
                    }
                }

                for (i = 0; i < toDelete.length; i++) {
                    var idx = this.inputCorrectionBuffer.indexOf(toDelete[i]);
                    this.inputCorrectionBuffer.splice(idx, 1);
                }
            }
        }
    };

    /**
     * Apply input prediction
     */
    MoveComponent.prototype.inputPrediction = function(playerActions) {
        // Clear player actions for this frame and buffer them
        for (var j = 0; j < playerActions.length; j++) {
            var newAction = Util.clone(playerActions[j]);

            // Set the corrected server time to the action
            var instance = this.parentEntity.parentManager.parentInstance;
            newAction.network = false;

            this.inputCorrectionBuffer.push(newAction);
            if (this.inputCorrectionBuffer.length > this.inputCorrectionBufferSize) {
                this.inputCorrectionBuffer.shift();
            }
        }

        // Find the index of the already processed actions in the prediction stack
        var index = -1;
        var buf = this.inputCorrectionBuffer;
        var lastAck = this.parentEntity.parentManager.parentInstance.lastAckSequenceNumber;

        for (var i = 0; i < buf.length; i++) {
            if (buf[i].s > lastAck) {
                index = i;
                break;
            }
        }

        // No action found
        if (index === -1) {
            return;
        }

        // Remove all the actions before the found index
        buf.splice(0, index);

        // Apply the other actions in the buffer now
        //console.log(buf.length);
        for (i = 0; i < buf.length; i++) {
            playerActions.push(buf[i]);
        }

        /*console.log("---- serverTime: " + serverTime);
        for (var i = 0; i < buf.length; i++) {
            console.log(buf[i].t);
        }*/
    };

    // Destroy
    MoveComponent.prototype.destroy = function() {
        _super_.destroy.call(this);
    };

    return MoveComponent;
});
