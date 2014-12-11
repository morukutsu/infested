/**
* project_infested client
* Player.js - Basic game entity
*/

define('entities/player/Player',

// Includes
['entities/Entity', 'components/input/PlayerInputComponent'],

function(Entity, PlayerInputComponent) {

    // Constructor
    var Player = function() {
        Entity.call(this);
    };

    Player.prototype = Object.create(Entity.prototype);
    var _super_ = Entity.prototype;

    // Init
    Player.prototype.init = function() {
        _super_.init.call(this);

        this.playerInputComponent = new PlayerInputComponent();
        this.componentManager.add(this.playerInputComponent);
    };

    // Update
    Player.prototype.update = function(dt) {
        _super_.update.call(this);
    };

    // Destroy
    Player.prototype.destroy = function() {
        _super_.destroy.call(this);
    };

    return Player;
});
