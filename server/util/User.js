/**
* project_infested server
* User.js - Network login and user management
*/

define(

// Includes
[
    '../../common/util/BaseUser'
],

function(BaseUser) {

    /**
    * Constructor
    */
    var User = function() {
        BaseUser.call(this);
    };

    User.prototype = Object.create(BaseUser.prototype);
    var _super_ = BaseUser.prototype;

    return User;
});
