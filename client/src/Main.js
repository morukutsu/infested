/**
 * project_infested client
 * main.js - Phaser configuration and game entry point
 */

// Configure Phaser framework
requirejs.config({
    paths: {
        Phaser: 'lib/phaser.min'
    },
    map: {
        '*': {
            phaser: 'Phaser'
        }
    }
});

// Start game module
var game = require(['Game']);
