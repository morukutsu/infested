/**
* project_infested server
* Socket.js - Socket additional functions & wrappers
*/

/**
 * Server fake latency in ms
 */
var fakeLag = 50;

export default class Socket {
    constructor() {

    }

    /**
     * Server emit function wrapper, handle fake latency management
     */
    emit(socket, command, data) {
        // Send packet
        if (fakeLag === 0) {
            socket.emit(command, data);
        } else {
            setTimeout(function() {
                socket.emit(command, data);
            }, fakeLag);
        }
    }

    /**
     * Server on funciton wrapper, handle fake latency management
     */
    on(socket, command, callback) {
        if (fakeLag === 0) {
            socket.on(command, callback);
        } else {
            socket.on(command, function(data) {
                setTimeout(function() {
                    callback(data);
                }, fakeLag);
            }.bind(socket));
        }
    }
}
