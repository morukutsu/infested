/**
* project_infested client
* NetworkComponent.js - Manages the network interactions for a moving entity
*/

define(

// Includes
['components/Component'],

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
     * Sends an action to the server
     */
     NetworkComponent.prototype.sendAction = function(action) {
         var socket = this.socket;
         socket.emit('action', action);
     };

    return NetworkComponent;
});
