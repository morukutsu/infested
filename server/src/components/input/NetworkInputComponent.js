/**
* project_infested server
* NetworkInputComponent.js - Manages all player inputs recevied from clients
*/

import Component from '../../common/components/Component';
import Util from '../../common/util/Util';
import Socket from '../../util/Socket';

export default class NetworkInputComponent extends Component {
    // Constructor
    constructor(socket) {
        super();

        this.socket = socket;
    }

    // Init
    init() {
        super.init();

        // Setup network input action listeners
        Socket.on(this.socket, 'action', this.handleNetworkAction.bind(this));
    }

    // Process mouse events
    handleNetworkAction(action) {
        this.parentEntity.playerActions.push(action);
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
