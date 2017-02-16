'use strict';

angular.module('myApp.view2', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/view2', {
            templateUrl: 'views/view2.html',
            controller: 'controller2'
        });
    }])

    .controller('controller2', [function() {

    }]);