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

        // Setup some base stats for the Player
        // TODO: move them to a stats objects which be can updated via
        // network and stuff
        this.stats = {
            speed: 2.0
        };
    };

    Player.prototype = Object.create(Entity.prototype);
    var _super_ = Entity.prototype;

    // Init
    Player.prototype.init = function() {
        _super_.init.call(this);

        var game = this.game;

        // Create some sprites
        // TODO: move then to a display component
        var sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'scientist');
        sprite.anchor.setTo(0.5, 0.5);
        this.sprite = sprite;

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
