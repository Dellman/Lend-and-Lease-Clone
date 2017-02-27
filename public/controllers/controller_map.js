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

    .controller('controller_map', ['$scope', '$http', 'NgMap', '$rootScope', function ($scope, $http, NgMap, $rootScope) {

        $scope.vm = {};
        $scope.vm.message = 'You can not hide. :)';
        NgMap.getMap().then(function(map) {
            $scope.vm.map = map;
        });







        $scope.vm.positions1 =[
            {pos:[59.11, 17.21],name:1}, {pos:[59.22, 17.60],name:2},
            {pos:[59.33, 17.99],name:3}, {pos:[59.44, 17.88],name:4},
            {pos:[59.55, 17.77],name:5}, {pos:[59.66, 17.66],name:6}];
















        $http({
            method : "GET",
            url : $rootScope.serverIP + "/items"
        }).then(function mySucces(response) {
            $scope.items = response.data;
            console.log($scope.items);
        }, function myError(response) {
            //alert("Error");
        });


    }]);

