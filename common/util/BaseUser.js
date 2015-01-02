/**
 * project_infested common
 * BaseUser.js - User management
 *  This class stores all the required informations to communicate with a
 *  logged user. The data are non-persistent.
 */

define(

// Includes
[],

function() {

    /**
     * Constructor
     */
    var User = function() {
        /**
         * The websocket obtained after the connect process
         */
        this.socket = null;

        /**
         * The logged player username
         */
        this.username = null;

        /**
         * The last computed round-trip time between the user and the server
         */
        this.latency = 0;
    };

    return User;
});
