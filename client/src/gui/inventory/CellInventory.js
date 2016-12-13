/**
 * project_infested server
 * CellIventory.js - An inventory containing a list of agregated cells
 */

define(

// Includes
[
    'gui/inventory/Cell',
    'gui/inventory/InventoryObject'
],

function(Cell, InventoryObject) {
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

    /**
     * Creates the inventory cells
     */
    CellInventory.prototype.init = function() {
        for (var i = 0; i < this.width; i++) {
            var column = [];
            for (var j = 0; j < this.height; j++) {
                var cell = new Cell(i, j, this);
                cell.game = this.game;
                cell.init();

                column.push(cell);
            }
            this.cells.push(column);
        }

        // tmp
        this.addObject();
    };

    /**
     * Update function
     */
    CellInventory.prototype.update = function(dt) {
        // Update cells
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                this.cells[i][j].update(dt);
            }
        }
    };

    /**
     * Add an object in the inventory
     */
    CellInventory.prototype.addObject = function() {
        var targetCell = this.cells[0][0];
        var obj = new InventoryObject(0, 0, targetCell);
        obj.game = this.game;
        obj.init();
    };

    // todo: to remove
    CellInventory.prototype.render = function() {

    };

    return CellInventory;
});
