"use strict";

require("angular");
require("angular-route");

var common = angular.module("common", [])
    .factory("notifier", require("./notifier"))
;

module.exports = common;