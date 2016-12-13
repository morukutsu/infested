/**
* project_infested client
* PlayerInputComponent.js - Manages all player inputs
*/

import Component from '../../common/components/Component';
import Util from '../../common/util/Util';
import Phaser from 'phaser-shim';

export default class PlayerInputComponent extends Component {
    // Constructor
    constructor() {
        super();
    }

    // Init
    init() {
        super.init();

        var game = this.parentEntity.game;

        this.keyboardCursors = game.input.keyboard.createCursorKeys();
    }

    // Update
    update(dt) {
        super.update(dt);

        // Request all player actions for this frame
        this.parentEntity.playerActions = this.requestPlayerActions();
    }

    // Process player inputs and build a list of user actions
    requestPlayerActions() {
        var actions = [];

        /*var mouseActions = this.handleMouse();
        actions = actions.concat(mouseActions);*/

        var padActions = this.handlePad();
        actions = actions.concat(padActions);

        return actions;
    }

    // Process mouse events
    handleMouse() {
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
        }

        return mouseActions;
    }

    /**
     * Process keyboard events
     */
    handlePad() {
        var padActions = [];

        // Read inputs for curson keys
        var directionX = 0;
        var directionY = 0;
        var cursors = this.keyboardCursors;

        if (cursors.left.isDown) {
            directionX -= 1;
        }

        if (cursors.right.isDown) {
            directionX += 1;
        }

        if (cursors.up.isDown) {
            directionY -= 1;
        }

        if (cursors.down.isDown) {
            directionY += 1;
        }

        // Construct action
        if (directionX !== 0 || directionY !== 0) {
            var action = {
                type: 'MoveCharacter',
                network: true,
                directionX: directionX,
                directionY: directionY
            };

            // TODO: move this so generalize it
            // Append sequence number
            action.s = this.parentEntity.parentManager.parentInstance.user.getNextSequenceNumber();

            padActions.push(action);
        }

        return padActions;
    }

    /**
     * Find an action in an action stack
     * @return integer index of the found element
     */
    findAction(type, stack) {
        for (var i = 0; i < stack.length; i++) {
            var action = stack[i];

            if (action.type === type) {
                return i;
            }
        }

        return -1;
    }

    // Destroy
    destroy() {
        super.destroy();
    }
}
