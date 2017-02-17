/**
 * Created by Basel on 2/16/2017.
 */

angular.module('myApp.add_user', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/registerUser', {
            templateUrl: 'views/add_user.html',
            controller: 'controller_add_user'
        });
    }])

    .controller('controller_add_user', ['$scope', '$http', function($scope, $http) {

        $scope.submit = function(){

            var date1 = $scope.user.dob;
            var date3 = date1.getFullYear() + '-' + date1.getMonth() + '-' + date1.getDate();

            $http({
                method : "POST",
                url : "http://198.211.126.133:3000/register",
                headers: {
                    'Content-Type': "application/json"
                },
                data: {
                    "last_name" : $scope.user.lname,
                    "first_name" : $scope.user.fname,
                    "address" : "000,000",
                    "date_of_birth" : date3,
                    "email" : $scope.user.email,
                    "phone" : $scope.user.phone,
                    "password" : $scope.user.password
                }
            }).then(function mySucces(response) {
                alert(response);
            }, function myError(response) {
                alert("Error, response is: " + response);
            });

        };

    }]);

