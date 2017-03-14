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

    .controller('controller_profile', ['$scope', '$http', '$rootScope', '$window', function($scope, $http, $rootScope, $window) {

        $http({
            method: "GET",
            url: $rootScope.serverIP + "/loggedin",
            headers: {
                'Content-Type': "application/json"
            }
        }).then(function success(response) {
            console.log(response)
            if (response.data.code == 109) {
                //NOT Signed IN!!!
                document.querySelector('#sidebar-menu > div > ul > li:nth-child(2) > a').style.display = 'none';
                document.querySelector('#sidebar-menu > div > ul > li:nth-child(3) > a').style.display = 'none';
                document.querySelector('#sidebar-menu > div > ul > li:nth-child(4) > a').style.display = 'none';
                document.querySelector('body > div > div > div.top_nav > div > nav > ul > li:nth-child(1) > a').classList.remove("disabled");

                document.getElementById("account1").innerHTML = "";
                $('#account1').show();
                document.getElementById("account2").innerHTML = "Login";
                $("#logout").hide();
            }
            else {
                //SIGNED IN!!!
                document.querySelector('#sidebar-menu > div > ul > li:nth-child(2) > a').style.display = 'block';
                document.querySelector('#sidebar-menu > div > ul > li:nth-child(3) > a').style.display = 'block';
                document.querySelector('#sidebar-menu > div > ul > li:nth-child(4) > a').style.display = 'block';
                document.querySelector('body > div > div > div.top_nav > div > nav > ul > li:nth-child(1) > a').classList.add("disabled");

                document.getElementById("account1").innerHTML = response.data.email.email;
                $('#account1').show();
                document.getElementById("account2").innerHTML = response.data.email.email;

                $http({
                    method: "GET",
                    url: $rootScope.serverIP + "/getprofilepic",
                    headers: {
                        'Content-Type': "application/json"
                    }
                }).then(function success(response) {
                    console.log(response.data)
                    document.getElementById("p-image").src= "/images/" + response.data
                }, function failed(){})


                $("#logout").show();
                $("#logout").on("click", function () {
                    $http({
                        method: "GET",
                        url: $rootScope.serverIP + "/logout",
                        headers: {
                            'Content-Type': "application/json",
                            'WWW-Authenticate': ""
                        }
                    }).then(function mySucces(response) {
                        console.log("Logged Out")
                        document.getElementById("account1").innerHTML = "";
                        $('#account1').show();
                        document.getElementById("account2").innerHTML = "Login";
                        $("#logout").hide();
                        $window.location.href = '/#!/map';
                    }, function myError() {
                        console.log("Error Logging out")
                    })

                });
            }

        }, function error() {
            alert("Error!")
        });

        $scope.user = {};

        $http({
            method : "GET",
            url : $rootScope.serverIP + "/profile"
        }).then(function mySucces(response) {
            console.log(response.data);
            var date = new Date (response.data[0].dob);

            $scope.user.fname = response.data[0].first_name;
            $scope.user.lname = response.data[0].last_name;
            // $scope.user.address = response.data[0].address;
            $scope.user.dob = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
            $scope.user.email = response.data[0].email;
            $scope.user.phone = response.data[0].phone;
            $scope.user.pic = "/images/" + response.data[0].pp_link

        }, function myError(response) {
            alert("Error");
        });

    }]);