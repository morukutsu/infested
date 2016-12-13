/**
 * project_infested server
 * Cell.js - An inventory cell
 */

export default class Cell {
    /**
     * Constructor
     */
    constructor(x, y, parent) {
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

        /**
         * Cell background sprite
         */
        this.sprite = null;
    }

    /**
     * Init function
     */
    init() {
        this.sprite = this.game.add.image(0, 0, 'inventoryCell');
        this.sprite.fixedToCamera = true;
    }

    /**
     * Update function for the Cell
     */
    update(dt) {
        var hover = this.isHovered();
        var clicked = this.isClicked();

        if (clicked) {
            //console.log(this.logicX, this.logicY);
        }

        // Move sprite to its position
        var position = this.getScreenPosition();
        this.sprite.cameraOffset.x = position.x;
        this.sprite.cameraOffset.y = position.y;

        // Update object if any
        if (this.inventoryObject !== null) {
            this.inventoryObject.update(dt);
        }
    }

    /**
     * Check if the Cell is currently hovered my the mouse
     */
    isHovered() {
        var mx = this.game.input.x,
            my = this.game.input.y;

        var inventory = this.parentInventory;
        var position = this.getScreenPosition();

        if (mx >= position.x && my >= position.y &&
            mx <= position.x + inventory.cellWidth && my <= position.y + inventory.cellHeight)
        {
            return true;
        }

        return false;
    }

    /**
     * Check if the Cell has been clicked
     */
    isClicked() {
        return this.isHovered() && this.game.input.activePointer.isDown;
    }

    /**
     * Computes cell position
     */
    getScreenPosition() {
        var inventory = this.parentInventory;

        return {
            x: inventory.x + this.logicX * inventory.cellWidth,
            y: inventory.y + this.logicY * inventory.cellHeight
        };
    }
}
