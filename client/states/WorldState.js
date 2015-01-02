/**
* project_infested client
* WorldState.js - World management gamestate
*/

define(

// Includes
[
    '../../common/entities/EntityManager',
    'entities/player/Player',
    'map/Map',
    'util/User',
    'debug/Gui'
],

function(EntityManager, Player, Map, User, Gui) {

    // Constructor
    var WorldState = function() {
        this.gui = new Gui();
    };

    WorldState.prototype.init = function() {
        var game = this.game;
        this.entityManager = new EntityManager(game);

        // Connect socket to server
        var user = new User();
        user.connect();
        this.socket = user.socket;

        // Initiate user login
        user.login(function(result) {
            if (result.sucess) {
                console.log("User login OK.");
            }
        });

        this.user = user;
    };

    WorldState.prototype.preload = function() {
        var game = this.game;
        console.log("state preload");

        //game.canvas.style.display = 'none';
        game.stage.smoothed = false;

        // TEMP - preload assets
        game.load.atlas('scientist', 'data/gfx/characters/scientist.png', 'data/gfx/characters/scientist.json');
        game.load.image('ground_1x1', 'data/gfx/tiles/ground_1x1.png');
    };

    WorldState.prototype.create = function() {
        console.log("state create");
        var game = this.game;


        // Map creation
        var map = new Map(game);
        map.create(32, 32);
        this.map = map;

        // Toast entity creation
        var player = new Player(this.socket);
        this.entityManager.add(player);

        this.cursors = game.input.keyboard.createCursorKeys();
    };

    WorldState.prototype.update = function() {
        var game = this.game;

        this.gui.ping = '' + this.user.latency + " ms";

        // Read dt (in secs) and update all the entities
        var dt = game.time.elapsed / 1000;
        this.entityManager.update(dt);


        // TMP
        //this.map.layer1.updateCrop();

        /*cursors = this.cursors;
        if (cursors.left.isDown)
        {
            game.camera.x -= 4;
        }
        else if (cursors.right.isDown)
        {
            game.camera.x += 4;
        }

        if (cursors.up.isDown)
        {
            game.camera.y -= 4;
        }
        else if (cursors.down.isDown)
        {
            game.camera.y += 4;
        }

        console.log("camX: " + game.camera.x + ", camY: " + game.camera.y);*/
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
