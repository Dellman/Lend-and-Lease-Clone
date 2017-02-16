/**
 * Created by Basel on 2/15/2017.
 */

angular.module('myApp.items_list', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/itemsList', {
            templateUrl: 'views/items_list.html',
            controller: 'controller_items_list'
        });
    }])

    .controller('controller_items_list', ['$scope', '$http', function($scope, $http) {
        $http({
            method : "GET",
            url : "http://198.211.126.133:3000/items"
        }).then(function mySucces(response) {
            $scope.items = response.data;
        }, function myError(response) {
            alert("Error");
        });

    }]);


