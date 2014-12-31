/**
* project_infested client
* NetworkComponent.js - Manages the network interactions for a moving entity
*/

define('components/network/NetworkComponent',

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

        // Network socket listeners
        var socket = this.socket;

        socket.on('news', function (data) {
            console.log("news");
        });
    };

    return NetworkComponent;
});
