/**
* project_infested client
* NetworkComponent.js - Manages the network interactions for a moving entity
*/

define(

// Includes
['../../../common/components/Component'],

function(Component) {
    /**
     * Constructor
     */
    var NetworkComponent = function(socket) {
        Component.call(this);

        this.socket = socket;
    };

    NetworkComponent.prototype = Object.create(Component.prototype);
    var _super_ = Component.prototype;

    /**
     * Initialization
     */
    NetworkComponent.prototype.init = function() {
        _super_.init.call(this);
    };

    /**
     * Processes actions which requires to be sent to the network
     */
     NetworkComponent.prototype.update = function(dt) {
        _super_.update.call(this, dt);
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
    };

    /**
     * Sends an action to the server
     */
     NetworkComponent.prototype.sendAction = function(action) {
         var socket = this.socket;
         socket.emit('action', action);
     };

    return NetworkComponent;
});
