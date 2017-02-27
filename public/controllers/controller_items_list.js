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

    .controller('controller_items_list', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
        $http({
            method : "GET",
            url : $rootScope.serverIP + "/items"
        }).then(function mySucces(response) {
            console.log(response.data)
            $scope.items = response.data;
        }, function myError(response) {
            alert("Error");
        });

    }]);


