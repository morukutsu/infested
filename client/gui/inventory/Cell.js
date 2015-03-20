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
    };

    /**
     * Check if the Cell is currently hovered my the mouse
     */
    Cell.prototype.isHovered = function() {
        return false;
    };

    /**
     * Check if the Cell has been clicked
     */
    Cell.prototype.isClicked = function() {
        return false;
    };

    return Cell;
});
