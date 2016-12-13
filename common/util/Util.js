/**
* project_infested client
* Util.js - Utility functions
*/

const Util = {
    clone: function clone(obj) {
        var copy;

        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj) return obj;

        // Handle Date
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            return obj.slice(0);
        }

        // Handle Object
        if (obj instanceof Object) {
            copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
            }
            return copy;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
    },

    /**
     * Iterate on hashmap keys
     */
    iterateMap: function(hashmap, callback) {
        for (var attr in hashmap) {
            if (hashmap.hasOwnProperty(attr)) {
                callback(hashmap[attr]);
            }
        }
    }
}

export default Util;
