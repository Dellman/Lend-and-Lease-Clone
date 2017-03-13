/**
 * Created by Basel on 2/17/2017.
 */
angular.module('myApp.profile', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/profile', {
            templateUrl: 'views/profile.html',
            controller: 'controller_profile'
        });
    }])

    .controller('controller_profile', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
        $scope.user = {};

        $http({
            method : "GET",
            url : $rootScope.serverIP + "/profile"
        }).then(function mySucces(response) {
            console.log(response.data[0]);
            var date = new Date (response.data[0].dob);

            $scope.user.fname = response.data[0].first_name;
            $scope.user.lname = response.data[0].last_name;
            // $scope.user.address = response.data[0].address;
            $scope.user.dob = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
            $scope.user.email = response.data[0].email;
            $scope.user.phone = response.data[0].phone;

        }, function myError(response) {
            alert("Error");
        });

    }]);