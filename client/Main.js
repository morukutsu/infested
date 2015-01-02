/**
 * project_infested client
 * main.js - Phaser configuration and game entry point
 */

// Configure Phaser framework
requirejs.config({
    shim: {
        'socketio': {
            exports: 'io'
        },
        'datgui': {
            exports: 'dat'
        }
    },
    paths: {
        Phaser: 'lib/phaser.min',
        socketio: 'lib/socket.io',
        datgui: 'lib/dat.gui.min'
    },
    map: {
        '*': {
            phaser: 'Phaser'
        }
    }
});

// Start game module
var game = require(['Game']);
