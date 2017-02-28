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
}]).
run(function ($rootScope) {
    $rootScope.serverIP = 'http://198.211.126.133:3000';
});