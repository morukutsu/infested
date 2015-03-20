/**
 * project_infested server
 * CellIventory.js - An inventory containing a list of agregated cells
 */

define(

// Includes
[
    'gui/inventory/Cell'
],

function(Cell) {
    /**
     * Constructor
     */
    var CellInventory = function(w, h, cellW, cellH) {
        /**
         * 2D array of cells
         */
        this.width = w;
        this.height = h;
        this.cells = [];

        for (var j = 0; j < h; j++) {
            var line = [];
            for (var i = 0; i < w; i++) {
                line.push(new Cell(i, j, this));
            }
            this.cells.push(line);
        }

        /**
         * Size of the cells
         */
        this.cellWidth = 32;
        this.cellHeight = 32;

        /**
         * Position of the Inventory on the screen
         */
        this.x = 0;
        this.y = 0;

        // tmp
        this.cellBackground = new Phaser.Rectangle(0, 0, this.cellWidth, this.cellHeight);
    };

    CellInventory.prototype.update = function(dt) {
        // Update cells
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                this.cells[i][j].update(dt);
            }
        }
    };

    CellInventory.prototype.render = function() {
        this.cellBackground.x = 0;
        this.cellBackground.y = 0;

        for (var i = 0; i < this.width; i++) {
            this.cellBackground.x = 0;
            for (var j = 0; j < this.height; j++) {
                this.cells[i][j].update(dt);
                this.game.debug.geom(this.cellBackground,'#0fffaa');
                this.cellBackground.x += this.cellWidth;
            }
            this.cellBackground.y += this.cellHeight;
        }
    };

    return CellInventory;
});
