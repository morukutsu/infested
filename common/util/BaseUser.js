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
    var BaseUser = function() {
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

        /**
         * The sequence number of the last sent / processed command
         */
        this.sequenceNo = 0;
    };

    BaseUser.prototype.getNextSequenceNumber = function() {
        this.sequenceNo++;
        return this.sequenceNo;
    };

    return BaseUser;
});
