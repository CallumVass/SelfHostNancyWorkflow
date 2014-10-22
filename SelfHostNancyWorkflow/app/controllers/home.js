"use strict";

/* @ngInject */
function home(testService, notifier) {
    var vm = this;
    vm.message = "Angular working!";
    vm.title = "hello world";

    testService.someMethod();
    notifier.someMethod();
}

module.exports = home;