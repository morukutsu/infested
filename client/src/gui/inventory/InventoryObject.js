/**
 * project_infested server
 * InventoryObject.js - An object in the inventory
 */

export default class InventoryObject {
    constructor(w, h, parentCell) {
        /**
         * The cell holding this object
         */
        this.parentCell = parentCell;
        this.parentCell.inventoryObject = this;

        /**
         * The object sprite
         */
        this.sprite = null;

        /**
         * Size of the object (in logic cells)
         */
        this.width = w;
        this.height = h;
    }

    /**
     * Init function
     */
    init() {
        this.sprite = this.game.add.image(0, 0, 'testobj');
        this.sprite.fixedToCamera = true;
        //this.sprite.z = 10;
    }

    /**
     * Update function
     */
    update(dt) {
        // Position object on the logic cell
        var position = this.parentCell.getScreenPosition();
        this.sprite.cameraOffset.x = position.x;
        this.sprite.cameraOffset.y = position.y;
    }
}
