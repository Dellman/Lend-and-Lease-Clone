/**
 * Created by Basel on 2/18/2017.
 */

angular.module('myApp.map', ['ngRoute', 'ngMap'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/map', {
            templateUrl: 'views/map_view.html',
            controller: 'controller_map'
        });
    }])

    .controller('controller_map', ['$scope', '$http', 'NgMap', function ($scope, $http, NgMap) {

        $scope.vm = {};
        $scope.vm.message = 'You can not hide. :)';
        NgMap.getMap().then(function(map) {
            $scope.vm.map = map;
        });


        $http({
            method : "GET",
            url : "http://198.211.126.133:3000/items"
        }).then(function mySucces(response) {
            $scope.items = response.data;
        }, function myError(response) {
            alert("Error");
        });


    }]);

