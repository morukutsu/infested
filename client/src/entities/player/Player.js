/**
* project_infested client
* Player.js - Basic game entity
*/

define('entities/player/Player',

// Includes
[
    'entities/Entity',
    'components/input/PlayerInputComponent',
    'components/network/NetworkComponent'
],

function(Entity, PlayerInputComponent, NetworkComponent) {

    // Constructor
    var Player = function(socket) {
        Entity.call(this);

        // Setup some base stats for the Player
        // TODO: move them to a stats objects which be can updated via
        // network and stuff
        this.stats = {
            speed: 100.0
        };

        this.socket = socket;
    };

    Player.prototype = Object.create(Entity.prototype);
    var _super_ = Entity.prototype;

    // Init
    Player.prototype.init = function() {
        _super_.init.call(this);

        var game = this.game;

        // Create some sprites
        // TODO: move then to a display component
        var sprite = game.add.sprite(0, 0, 'scientist');
        sprite.anchor.setTo(0.5, 0.5);
        this.sprite = sprite;
        game.camera.follow(this.sprite);
        //game.camera.setPosition(10, 10);

        this.playerInputComponent = new PlayerInputComponent();
        this.networkComponent = new NetworkComponent(this.socket);

        this.componentManager.add(this.playerInputComponent);
        this.componentManager.add(this.networkComponent);
    };

    // Update
    Player.prototype.update = function(dt) {
        _super_.update.call(this, dt);

        var game = this.game;

        // Sets the current player position
        // TODO: figure out if this is done at the right time because
        // others components processed after may influence the character
        // position
        this.sprite.x = this.position.x;
        this.sprite.y = this.position.y;
    };

    // Destroy
    Player.prototype.destroy = function() {
        _super_.destroy.call(this);
    };

    return Player;
});
