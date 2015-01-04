/**
* project_infested server
* NetworkInputComponent.js - Manages all player inputs recevied from clients
*/

define(

// Includes
[
    '../../../common/components/Component',
    '../../../common/util/Util',
    'util/Socket',
],

function(Component, Util, Socket) {

    // Constructor
    var NetworkInputComponent = function(socket) {
        Component.call(this);

        this.socket = socket;
    };

    NetworkInputComponent.prototype = Object.create(Component.prototype);
    var _super_ = Component.prototype;

    // Init
    NetworkInputComponent.prototype.init = function() {
        _super_.init.call(this);

        // Setup network input action listeners
        Socket.on(this.socket, 'action', this.handleNetworkAction.bind(this));
    };

    // Process mouse events
    NetworkInputComponent.prototype.handleNetworkAction = function (action) {
        this.parentEntity.playerActions.push(action);
    };

    /**
     * Find an action in an action stack
     * @return integer index of the found element
     */
     NetworkInputComponent.prototype.findAction = function(type, stack) {
        for (var i = 0; i < stack.length; i++) {
            var action = stack[i];

            if (action.type === type) {
                return i;
            }
        }

        return -1;
    };

    // Destroy
    NetworkInputComponent.prototype.destroy = function() {
        _super_.destroy.call(this);
    };

    return NetworkInputComponent;
});
