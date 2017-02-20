/**
 * Created by Basel on 2/17/2017.
 */

angular.module('myApp.login', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'views/login.html',
            controller: 'controller_login'
        });
    }])

    .controller('controller_login', ['$scope', '$http', '$location', function ($scope, $http, $location) {

        $scope.user = {};

        $scope.submit = function () {
            $http({
                method: "POST",
                url: "http://198.211.126.133:3000/login",
                headers: {
                    'Content-Type': "application/json"
                },
                data: {
                    "email": $scope.user.email,
                    "password": $scope.user.password
                }
            }).then(function mySucces(response) {
                if (response.data.code == 101) {
                    alert("Success, response is: " + response.data.message);
                    document.getElementById("account1").innerHTML = $scope.user.email;
                    document.getElementById("account2").innerHTML = $scope.user.email;
                    $location.path('/')
                }
                else {
                    alert("ERROR: " + response.data.code + "MESSAGE: " + response.data.message);
                }
            }, function myError(response) {
                alert("Error, response is: " + response.data);
            });
        };
    }]);

