/**
* project_infested common
* MoveComponent.js - Process an action to move a parent entity
*/

import Component from '../Component';
import Point from '../../phaser/Point';
import Util from '../../util/Util';

export default class MoveComponent extends Component {
    // Constructor
    constructor(isInputPrediction) {
        super();

        /**
         * Defines if the input prediction will be activated
         */
        this.isInputPrediction = isInputPrediction;
    }

    // Init
    init() {
        super.init();

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
        this.inputCorrectionBufferSize = 128;
    }

    // Update
    update(dt) {
        super.update(dt);

        // Apply input prediction
        // This will add a set of new actions in the action stack
        if (this.isInputPrediction) {
            this.inputPrediction(this.parentEntity.playerActions);
        }

        // Moves the component according to the registered player actions
        this.processPlayerActions(this.parentEntity.playerActions, dt);
    }

    // Process player actions
    processPlayerActions(playerActions, dt) {
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
            if (me.isInputPrediction && action.network) {
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
    }

    /**
     * Handles target movement
     */
    handleTargetMovement(playerActions) {
        //var oldTargetMovementState = Util.clone(this.targetMovementState);

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
    }

    /**
     * Apply input prediction
     */
    inputPrediction(playerActions) {
        // Merge input correction actions and current actions
        // Remove from the array all the ACKed actions
        for (var j = 0; j < playerActions.length; j++) {
            var newAction = Util.clone(playerActions[j]);

            // Prevent the action from beeing sent back to the network
            newAction.network = false;

            this.inputCorrectionBuffer.push(newAction);
            /*if (this.inputCorrectionBuffer.length > this.inputCorrectionBufferSize) {
                this.inputCorrectionBuffer.shift();
            }*/
        }

        let lastAck = this.parentEntity.parentManager.parentInstance.lastAckSequenceNumber;

        let index = -1;
        for (var i = this.inputCorrectionBuffer.length - 1; i >= 0; i--) {
            if (this.inputCorrectionBuffer[i].s <= lastAck) {
                index = i;
                break;
            }
        }

        if (index !== -1) {
            this.inputCorrectionBuffer.splice(0, index + 1);
        }

        // Move character at the last acked position
        this.parentEntity.position.x = this.parentEntity.positionAtAck.x;
        this.parentEntity.position.y = this.parentEntity.positionAtAck.y;

        for (i = 0; i < this.inputCorrectionBuffer.length; i++) {
            playerActions.push(this.inputCorrectionBuffer[i]);
        }
    }

    // Destroy
    destroy() {
        super.destroy();
    }
}
