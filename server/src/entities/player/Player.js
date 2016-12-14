/**
* project_infested server
* Player.js - Server side player entity
*/


import Entity from '../../common/entities/Entity';
import NetworkInputComponent from '../../components/input/NetworkInputComponent';
import MoveComponent from '../../common/components/physics/MoveComponent';

export default class Player extends Entity {
    // Constructor
    constructor(user) {
        super();

        this.type = 'player';

        // Setup some base stats for the Player
        // TODO: move them to a stats objects which be can updated via
        // network and stuff
        this.stats = {
            speed: 100.0
        };

        this.user = user;

        this.playerActions = [];
    }

    // Init
    init() {
        super.init();

        this.networkComponent = new NetworkInputComponent(this.user.socket);
        this.moveComponent = new MoveComponent();

        this.componentManager.add(this.networkComponent);
        this.componentManager.add(this.moveComponent);
    }

    // Update
    update(dt) {
        super.update(dt);

        // Read the last processed sequence number
        if (this.playerActions.length > 0) {
            this.user.sequenceNo = this.playerActions[this.playerActions.length - 1].s;
        }

        // Clean player actions buffer for next frame
        this.playerActions = [];
    }

    // Destroy
    destroy() {
        super.destroy();
    }

    /**
     * Generates data used for world snapshots
     */
    serialize() {
        var data = super.serialize();

        data.username = this.user.username;

        return data;
    }
}
