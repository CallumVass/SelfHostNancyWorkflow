"use strict";

/* @ngInject */
function home(testService) {
    var vm = this;
    vm.message = "Angular working!";
    vm.title = "hello world";

    testService.someMethod();
}

module.exports = home;