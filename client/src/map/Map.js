/**
* project_infested client
* Map.js - Manages the current displayed map (world map / instances)
* Displays generated map chunks sent from the server
*/

define('map/Map',

// Includes
[],

function() {
    // Constructor
    var Map = function(game) {
        this.width = 0;
        this.height = 0;
        this.game = game;
    };

    // Creates an empty mao filled with the base tile
    Map.prototype.create = function(width, height) {
        var game = this.game;

        this.width = width;
        this.height = height;

        this.map = game.add.tilemap();
        this.map.addTilesetImage('ground_1x1');


        this.layer1 = this.map.create('level1', this.width, this.height, 32, 32);
        //this.layer1.scrollFactorX = 1.0;
        //this.layer1.scrollFactorY = 1.0;
        this.layer1.fixedToCamera = false;

        this.layer1.resizeWorld();
        //game.camera.setBoundsToWorld();


        this.map.fill(0, 0, 0, this.width, this.width, this.layer1);
    };

    return Map;
});
