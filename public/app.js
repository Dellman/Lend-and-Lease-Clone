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
    $routeProvider.otherwise({redirectTo: '/addItem'});
}]).
run(function ($rootScope) {
    $rootScope.serverIP = 'http://localhost:3000';
});
