'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'ngMap',
    'myApp.add_item',
    'myApp.items_list',
    'myApp.add_user',
    'myApp.login',
    'myApp.profile',
    'myApp.map'
]).
config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');
    $routeProvider.otherwise({redirectTo: '/map'});
}])
    .directive('file', function () {
        return {
            scope: {
                file: '='
            },
            link: function (scope, el, attrs) {
                el.bind('change', function (event) {
                    var file = event.target.files[0];
                    scope.file = file ? file : undefined;
                    scope.$apply();
                });
            }
        };
    })
    .run(function ($rootScope) {
    $rootScope.serverIP = 'http://localhost:3000';
});
