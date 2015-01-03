/**
* project_infested server
* Player.js - Server side player entity
*/

define(

// Includes
[
    '../../../common/entities/Entity',
],

function(Entity) {

    // Constructor
    var Player = function(user) {
        Entity.call(this);

        this.type = 'player';

        // Setup some base stats for the Player
        // TODO: move them to a stats objects which be can updated via
        // network and stuff
        this.stats = {
            speed: 100.0
        };

        this.user = user;

    };

    Player.prototype = Object.create(Entity.prototype);
    var _super_ = Entity.prototype;

    // Init
    Player.prototype.init = function() {
        _super_.init.call(this);

    };

    // Update
    Player.prototype.update = function(dt) {
        _super_.update.call(this, dt);
    };

    // Destroy
    Player.prototype.destroy = function() {
        _super_.destroy.call(this);
    };

    /**
    * Generates data used for world snapshots
    */
    Player.prototype.serialize = function() {
        var data = _super_.serialize.call(this);

        data.username = this.user.username;

        return data;
    };

    return Player;
});
