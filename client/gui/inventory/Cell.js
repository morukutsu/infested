/**
 * project_infested server
 * Cell.js - An inventory cell
 */

define(

// Includes
[

],

function() {
    /**
     * Constructor
     */
    var Cell = function(x, y, parent) {
        /**
         * Position of this cell within the inventory
         */
        this.logicX = x;
        this.logicY = y;

        /**
         * True if there is no object overlaps the cell
         */
        this.free = true;

        /**
         * The object on the cell
         */
        this.inventoryObject = null;

        /**
         * Inventory containing the cell
         */
        this.parentInventory = parent;
    };

    /**
     * Update function for the Cell
     */
    Cell.prototype.update = function(dt) {
        var hover = this.isHovered();
        var clicked = this.isClicked();

        if (clicked) {
            //console.log(this.logicX, this.logicY);
        }
    };

    /**
     * Check if the Cell is currently hovered my the mouse
     */
    Cell.prototype.isHovered = function() {
        var mx = this.game.input.x,
            my = this.game.input.y;

        var inventory = this.parentInventory;
        var cellX = inventory.x + this.logicX * inventory.cellWidth;
        var cellY = inventory.y + this.logicY * inventory.cellHeight;

        if (mx >= cellX && my >= cellY &&
            mx <= cellX + inventory.cellWidth && my <= cellY + inventory.cellHeight)
        {
            return true;
        }

        return false;
    };

    /**
     * Check if the Cell has been clicked
     */
    Cell.prototype.isClicked = function() {
        return this.isHovered() && this.game.input.activePointer.isDown;
    };

    return Cell;
});
