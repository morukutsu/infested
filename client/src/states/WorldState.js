/**
 * project_infested client
 * WorldState.js - World management gamestate
 */

import EntityManager from '../common/entities/EntityManager';
import Player from '../entities/player/Player';
import Map from '../map/Map';
import User from '../util/User';
import Gui from '../debug/Gui';
import Instance from '../world/Instance';
import CellInventory from '../gui/inventory/CellInventory';

export default class WorldState {
    constructor() {
        //this.gui = new Gui();

        /**
         * Current instance
         */
        this.instance = null;

        //this.inventory = new CellInventory(10, 4, 32, 32);
    }

    init() {
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
    }

    preload() {
        var game = this.game;

        //game.canvas.style.display = 'none';
        game.stage.smoothed = false;

        // TEMP - preload assets
        game.load.atlas('scientist', 'data/gfx/characters/scientist.png', 'data/gfx/characters/scientist.json');
        game.load.image('ground_1x1', 'data/gfx/tiles/ground_1x1.png');
        game.load.image('inventoryCell', 'data/gfx/gui/inventorycell.png');
        game.load.image('testobj', 'data/gfx/gui/testobj.png');
    }

    create() {
        var game = this.game;

        // Creates the world instance
        this.instance = new Instance(game, this.user);

        /*this.inventory.game = this.game;
        this.inventory.init();*/
    }

    update() {
        var game = this.game;
        game.stage.disableVisibilityChange = true;

        // Debug: update ping display
        //this.gui.ping = '' + this.user.latency + " ms";

        // Read dt (in secs) and update all the entities
        var dt = game.time.elapsed / 1000;
        this.instance.update(dt);

        //tmp
        /*this.inventory.update(dt);*/
    }

    paused() {

    }

    shutdown() {

    }

    render() {
        // Render at 2X scale
        //this.pixel.context.drawImage(this.game.canvas, 0, 0, this.game.width, this.game.height, 0, 0, this.pixel.width, this.pixel.height);

        // TODO: change this (render is not suited for this)
        // render the menu
        //this.inventory.render();
    };
}
