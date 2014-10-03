"use strict";

function testService() {

    return {
        someMethod: function() {
            console.log("called someMethod");
        }
    }
}

module.exports = testService;