"use strict";

/* @ngInject */
function notifier() {

    return {
        someMethod: function() {
            console.log("called someMethod", "notifier");
        }
    }
}

module.exports = notifier;