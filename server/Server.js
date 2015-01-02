/**
 * project_infested server
 * Server.js - Main server logic
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(

// Includes
[],

function() {
    // Constructor
    var Server = function() {
        console.log("Server class created !");
    };

    return Server;
});
