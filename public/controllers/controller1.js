'use strict';

angular.module('myApp.view1', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'views/view1.html',
            controller: 'controller1'
        });
    }])

    .controller('controller1', [function() {

    }]);