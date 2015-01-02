/**
* project_infested client
* Gui.js - Debug GUI controls
*/

define(

// Includes
[
    'datgui',
],

function(dat) {
    /**
     * Constructor
     */
    var Gui = function() {
        this.version = 'infested alpha 0.0.1';

        // Creates the GUI interface and add controls
        // Documentation: http://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
        var gui = new dat.GUI();
        gui.add(this, 'version');
    };

    return Gui;
});
