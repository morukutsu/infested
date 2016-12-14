/**
* project_infested client
* Gui.js - Debug GUI controls
*/

//var dat = require('../lib/dat.gui.min.js');

export default class Gui  {
    constructor() {
        this.version = 'infested alpha 0.0.1';
        this.ping = '0 ms';

        // Creates the GUI interface and add controls
        // Documentation: http://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
        //var gui = new dat.GUI();
        //gui.add(this, 'version');
        //gui.add(this, 'ping').listen();
    }
}
