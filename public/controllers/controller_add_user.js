/**
 * Created by Basel on 2/16/2017.
 */

angular.module('myApp.add_user', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/registerUser', {
            templateUrl: 'views/add_user.html',
            controller: 'controller_add_user'
        });
    }])

    .controller('controller_add_user', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {

        $scope.submit = function () {

            var date1 = $scope.user.dob;
            var date3 = date1.getFullYear() + '-' + date1.getMonth() + '-' + date1.getDate();

            $http({
                method: "POST",
                url: $rootScope.serverIP + "/register",
                headers: {
                    'Content-Type': "application/json"
                },
                data: {
                    "last_name": $scope.user.lname,
                    "first_name": $scope.user.fname,
                    "address": "000,000",
                    "date_of_birth": date3,
                    "email": $scope.user.email,
                    "phone": $scope.user.phone,
                    "password": $scope.user.password
                }
            }).then(function mySucces(response) {
                if (response.data.code == 101) {
                    alert("Success, response is: " + response.data.message);
                }
                else {
                    alert("ERROR: " + response.data.code + "MESSAGE: " + response.data.message);
                }
            }, function myError(response) {
                alert("Error, response is: " + response);
            });

        };

    }]);

