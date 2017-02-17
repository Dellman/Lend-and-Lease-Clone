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

    .controller('controller_profile', ['$scope', '$http', function($scope, $http) {
        $scope.user = {};
        $http({
            method : "GET",
            url : "http://198.211.126.133:3000/profile"
        }).then(function mySucces(response) {
            console.log(response.data);
            $scope.user.fname = response.data.first_name;
            $scope.user.lname = response.data.last_name;
            $scope.user.address = response.data.address;
            $scope.user.dob = response.data.date_of_birth;
            $scope.user.email = response.data.email;
            $scope.user.phone = response.data.phone;

        }, function myError(response) {
            alert("Error");
        });

    }]);