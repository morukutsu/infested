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
    'debug/Gui',
    'world/Instance',
    'gui/inventory/CellInventory'
],

function(EntityManager, Player, Map, User, Gui, Instance, CellInventory) {

    // Constructor
    var WorldState = function() {
        this.gui = new Gui();

        /**
         * Current instance
         */
        this.instance = null;

        this.inventory = new CellInventory(10, 4, 32, 32);
    };

    WorldState.prototype.init = function() {
        var game = this.game;
        var me = this;

        // Setup Offline mode
        var isOfflineMode = false;

        // Connect socket to server
        var user = new User(isOfflineMode);
        user.connect();

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

        //game.canvas.style.display = 'none';
        game.stage.smoothed = false;

        // TEMP - preload assets
        game.load.atlas('scientist', 'data/gfx/characters/scientist.png', 'data/gfx/characters/scientist.json');
        game.load.image('ground_1x1', 'data/gfx/tiles/ground_1x1.png');
        game.load.image('inventoryCell', 'data/gfx/gui/inventorycell.png');
    };

    WorldState.prototype.create = function() {
        var game = this.game;

        // Creates the world instance
        this.instance = new Instance(game, this.user);

        this.inventory.game = this.game;
        this.inventory.init();
    };

    WorldState.prototype.update = function() {
        var game = this.game;
        game.stage.disableVisibilityChange = true;

        // Debug: update ping display
        this.gui.ping = '' + this.user.latency + " ms";

        // Read dt (in secs) and update all the entities
        var dt = game.time.elapsed / 1000;
        this.instance.update(dt);

        //tmp
        this.inventory.update(dt);
    };

    WorldState.prototype.paused = function() {

    };

    WorldState.prototype.shutdown = function() {

    };

    WorldState.prototype.render = function() {
        // Render at 2X scale
        //this.pixel.context.drawImage(this.game.canvas, 0, 0, this.game.width, this.game.height, 0, 0, this.pixel.width, this.pixel.height);

        // TODO: change this (render is not suited for this)
        // render the menu
        this.inventory.render();
    };

    return WorldState;
});
