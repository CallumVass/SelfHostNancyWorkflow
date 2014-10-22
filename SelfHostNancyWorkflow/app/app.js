"use strict";

require("angular");
require("angular-route");
require("./common/common");

angular.module("app", ["ngRoute", "common"])
    .config(function ($routeProvider) {
        $routeProvider.when("/", {
            templateUrl: "./content/templates/home.html",
            controller: "home",
            controllerAs: "vm"
        })
        ;
    })
    .factory("testService", require("./services/testService"))
    .controller("home", require("./controllers/home"))
    ;