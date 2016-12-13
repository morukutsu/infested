/**
* project_infested client
* Game.js - Phaser initialization
*/
/*import 'phaser/src/pixi/Pixi.js';
import './p2';
import Phaser from 'phaser/build/custom/phaser-split.js';*/

import Phaser from 'phaser-shim';

/*global.PIXI = require('phaser/src/pixi/Pixi.js');
global.p2 = require('p2');
global.Phaser = require('phaser');*/


/*require(['states/WorldState', 'Phaser'], function(WorldState) {
    "use strict";
*/
    // Configure screen resolution
    var SCREEN_WIDTH  = 1280;
    var SCREEN_HEIGHT = 720;
    var CLIENT_VERSION = '0.0.1';

    // Create default state (WorldState)
    //var worldState = new WorldState();

    // Prepare scaling factors setup (2x scale)
    var pixel = { scale: 2, canvas: null, context: null, width: 0, height: 0 };
    pixel.width = SCREEN_WIDTH;
    pixel.height = SCREEN_HEIGHT;

    //worldState.pixel = pixel;

    // Create main game object
    //console.log(Phaser);
    var game = new Phaser.Game(pixel.width / pixel.scale, pixel.height / pixel.scale, Phaser.CANVAS, '', /*worldState*/ null);

    // Setup new scaled canvas and hide the non-scaled one
    //pixel.canvas = Phaser.Canvas.create(pixel.width * pixel.scale, pixel.height * pixel.scale);
    //pixel.context = pixel.canvas.getContext('2d');
    //Phaser.Canvas.addToDOM(pixel.canvas);

    // Disable smoothing for pixel perfect rendering of our pixel art assets
    //Phaser.Canvas.setSmoothingEnabled(pixel.context, false);
//});
