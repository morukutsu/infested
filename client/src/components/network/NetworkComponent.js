/**
* project_infested client
* NetworkComponent.js - Manages the network interactions for a moving entity
*/

import Component from '../../common/components/Component';

export default class NetworkComponent extends Component {
    constructor(socket) {
        super();

        this.socket = socket;
    }

    /**
     * Initialization
     */
    init() {
        super.init();
    }

    /**
     * Processes actions which requires to be sent to the network
     */
    update(dt) {
        super.update(dt);
        var me = this;

        // Request all player actions for this frame
        var playerActions = this.parentEntity.playerActions;
        if (playerActions) {
            playerActions.forEach(function(action) {
                if (action.network) {
                    me.sendAction(action);
                }
            });
        }
    }

    /**
     * Sends an action to the server
     */
    sendAction(action) {
         var socket = this.socket;

         // Send action to the socket
         socket.emit('action', action);
     }
}
