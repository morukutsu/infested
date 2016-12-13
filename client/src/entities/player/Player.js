/**
 * project_infested client
 * Player.js - Client side player entity
 */

import Entity from '../../common/entities/Entity';
import PlayerInputComponent from '../../components/input/PlayerInputComponent';
import NetworkComponent from '../../components/network/NetworkComponent';
import MoveComponent from '../../common/components/physics/MoveComponent';

export default class Player extends Entity {
    /**
     * Constructor
     * @param socket The socket to use to communicate with the server
     * @param userControlled true if the entity to spawn will be controlled by the user
     * @param isInputPrediction true to enable input prediction
     */
    constructor(socket, userControlled, isInputPrediction) {
        super();

        this.type = 'player';

        // Setup some base stats for the Player
        // TODO: move them to a stats objects which be can updated via
        // network and stuff
        this.stats = {
            speed: 100.0
        };

        this.socket = socket;

        this.userControlled = userControlled;

        this.isInputPrediction = isInputPrediction;
    }

    // Init
    init() {
        super.init();

        var game = this.game;

        // Create some sprites
        // TODO: move then to a display component
        var sprite = game.add.sprite(0, 0, 'scientist');
        sprite.anchor.setTo(0.5, 0.5);
        this.sprite = sprite;

        if (this.userControlled) {
            game.camera.follow(this.sprite);

            this.playerInputComponent = new PlayerInputComponent();

            // No network component in offline mode
            if (this.socket) {
                this.networkComponent = new NetworkComponent(this.socket);
                this.componentManager.add(this.networkComponent);
            }

            this.moveComponent = new MoveComponent(this.isInputPrediction);
            this.componentManager.add(this.playerInputComponent);
            this.componentManager.add(this.moveComponent);
        }
    }

    // Update
    update(dt) {
        super.update(dt);

        var game = this.game;

        // Sets the current player position
        // TODO: figure out if this is done at the right time because
        // others components processed after may influence the character
        // position
        this.sprite.x = this.position.x;
        this.sprite.y = this.position.y;
    }

    // Destroy
    destroy() {
        super.destroy();
    }
}
