/**
* project_infested client
* WorldState.js - World management gamestate
*/

define('states/WorldState',

// Includes
['entities/EntityManager', 'entities/player/Player', 'map/Map'],

function(EntityManager, Player, Map) {

    // Constructor
    var WorldState = function() {

    };

    WorldState.prototype.init = function() {
        var game = this.game;
        this.entityManager = new EntityManager(game);
    };

    WorldState.prototype.preload = function() {
        var game = this.game;
        console.log("state preload");

        //game.canvas.style.display = 'none';
        game.stage.smoothed = false;

        // TEMP - preload assets
        game.load.atlas('scientist', 'src/data/gfx/characters/scientist.png', 'src/data/gfx/characters/scientist.json');
        game.load.image('ground_1x1', 'src/data/gfx/tiles/ground_1x1.png');
    };

    WorldState.prototype.create = function() {
        console.log("state create");
        var game = this.game;


        // Map creation
        var map = new Map(game);
        map.create(40, 40);

        // Toast entity creation
        var player = new Player();
        this.entityManager.add(player);

    };

    WorldState.prototype.update = function() {
        var game = this.game;

        // Read dt (in secs) and update all the entities
        var dt = game.time.elapsed / 1000;
        this.entityManager.update(dt);
    };

    WorldState.prototype.paused = function() {

    };

    WorldState.prototype.shutdown = function() {
        this.entityManager.clear();
    };

    /*WorldState.prototype.render = function() {
        // Render at 2X scale
        this.pixel.context.drawImage(this.game.canvas, 0, 0, this.game.width, this.game.height, 0, 0, this.pixel.width, this.pixel.height);
    };*/

    return WorldState;
});
