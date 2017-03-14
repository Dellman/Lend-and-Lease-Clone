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

    .controller('controller_items_list', ['$scope', '$http', '$rootScope', '$window', function($scope, $http, $rootScope, $window) {

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

                document.getElementById("p-image").src= "theme/images/img.jpg"

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
                    document.getElementById("p-image").src= "/images/" + response.data.pp_link
                }, function failed(){})


                $("#logout").show();
                $( "#logout" ).on( "click", function(){
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
                    }, function myError(){
                        console.log("Error Logging out")
                    })

                } );
            }

        }, function error() {
            alert("Error!")
        });






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


