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

    .controller('controller_login', ['$scope', '$http', '$location', '$rootScope', function ($scope, $http, $location, $rootScope) {

        $scope.user = {};

        function adjustwidth() {
            var containerWidth = $('body > div.container.body > div > div.right_col > div > div.ng-scope > div > div > div > div > div').width();
            if (containerWidth < 700) {
                $('#s-signup > form > div:nth-child(8)').css('transform', 'translate(0, 0)');
                $('#s-signup > form > div:nth-child(8)').css('width', 'auto');
            }
            else {
                $('#s-signup > form > div:nth-child(8)').css('transform', 'translate(-25%, 0)');
                $('#s-signup > form > div:nth-child(8)').width(containerWidth / 1.5);
            }
        }

        $(window).resize(adjustwidth);
        adjustwidth();

        $("#single_cal4").daterangepicker({
            singleDatePicker: !0,
            singleClasses: "picker_1",
            locale: {
                format: 'DD/MMM/YYYY'
            }
        }, function (a, b, c) {
            console.log("A: " + a + ", B: " + b + ", C: " + c)
            var endDate = $("#single_cal4").data('daterangepicker').endDate.format('YYYY-MM-DD');
            console.log(endDate);
            //console.log(new Date(a).toLocaleString())
            console.log(new Date(b).toLocaleString())
        });

        $('#s-signup').hide();
        $scope.f = function () {
            $("#s-signin").hide('linear', function () {
                $('#s-signup').show('linear');
            });
        }
        $scope.f2 = function () {
            $("#s-signup").hide('linear', function () {
                $('#s-signin').show('linear');
            });
        }

        $("#search_bar").hide();

        $scope.login = function () {

            $http({
                method: "POST",
                url: $rootScope.serverIP + "/login",
                headers: {
                'Content-Type' : 'application/json'
                },
                data: {
                    "email": $scope.user.email,
                    "password": $scope.user.password
                }
            }).then(function mySucces(response) {
                if (response.data.code == 101) {
                    alert("Success, response is: " + response.data.message);
                    document.getElementById("account1").innerHTML = $scope.user.email;
                    $('#account1').show();
                    document.getElementById("account2").innerHTML = $scope.user.email;
                    $("#logout").show();
                    $location.path('/');
                }
                else {
                    alert("ERROR: " + response.data.code + "MESSAGE: " + response.data.message);
                }
            }, function myError(response) {
                alert("Error, response is: " + response.data);
            });
        };

        $scope.signup = function () {

            $http({
                method: "POST",
                url: $rootScope.serverIP + "/register",
                headers: {
                    'Content-Type': "application/json",
                    'WWW-Authenticate': ""
                },
                data: {
                    "last_name": $scope.user.lname,
                    "first_name": $scope.user.fname,
                    "address": "000,000",
                    "date_of_birth": $("#single_cal4").data('daterangepicker').endDate.format('YYYY-MM-DD'),
                    "email": $scope.user.email,
                    "phone": $scope.user.phone,
                    "password": $scope.user.password
                }
            }).then(function mySucces(response) {
                if (response.data.code == 101) {
                    alert("Success, response is: " + response.data.message);
                    $location.path('/login');

                }
                else {
                    alert("ERROR: " + response.data.code + "MESSAGE: " + response.data.message);
                }
            }, function myError(response) {
                alert("Error, response is: " + response);
            });
        }
    }]);
