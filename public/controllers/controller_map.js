/**
 * Created by Basel on 2/18/2017.
 */

angular.module('myApp.map', ['ngRoute', 'ngMap'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/map', {
            templateUrl: 'views/map_view.html',
            controller: 'controller_map'
        });
    }])
    .controller('controller_map', ['$scope', '$http', 'NgMap', '$rootScope', '$window', function ($scope, $http, NgMap, $rootScope, $window) {

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
                        $window.location.reload();
                    }, function myError() {
                        console.log("Error Logging out")
                    })

                });
            }

        }, function error() {
            alert("Error!")
        });

        $http({
            method: "GET",
            url: $rootScope.serverIP + "/allItems",
            headers: {
                'Content-Type': "application/json"
            }
        }).then(function mySucces(response) {
            $scope.items = response.data;

            NgMap.getMap({id: 'mapViewMap'}).then(function (map) {
                $scope.map = map;
            }).then(function () {

              console.log($scope.items);
                var itemMarkers = [];

                for (var i = 0; i < $scope.items.length; i++) {
                    if ($scope.items[i].length > 0) {
                        for (var j = 0; j < $scope.items[i].length; j++) {
                            var latLngStr = $scope.items[i][j].location.split(',', 2);
                            var markerLatLng = new google.maps.LatLng();
                            markerLatLng.lat = parseFloat(latLngStr[0].trim());
                            markerLatLng.lng = parseFloat(latLngStr[1].trim());
                            $scope.items[i][j].location = markerLatLng;
                            addMarker($scope.items[i][j]);
                        }
                    }
                }

                function addMarker(item) {
                  // console.log(item);
                  // if (item.category.toUpperCase() = "BOOKS") {
                  //   console.log("Test");
                  // }
                  var marker = new google.maps.Marker({
                      position: {lat: item.location.lat, lng: item.location.lng},
                      map: $scope.map,
                      name: item.item_name,
                      category: item.category,
                      // subCategory: item.sub_category,

                      description: item.description,
                      image: item.img_link,
                      id: item.item_id
                    });
                  // Popup window
                  var infowindow = new google.maps.InfoWindow({
                      content: "<h5>" + marker.name + "</h5>" +
                      "<h6>" + marker.category.toUpperCase() + "</h6>" +
                      // "<h6>" + marker.subCategory.toUpperCase() + "</h6>" +
                      "<p>" + marker.description + "</p>" +
                      "<div style='overflow:hidden;'><img style='width: 225px; height:225px' src='/images/" + marker.image + "'/>" +
                      "<input type='button' value='Request Item' style='display:block; margin:0.25em auto;' onclick='" +
                      "$http({method: 'POST',url: $rootScope.serverIP + '/requestItem', headers: {'Content-Type': 'application/json'}, data:{})." +
                      "then(function success(response) {" +
                      "}, function failed(){}" +
                      "" +
                      "'/></div>"
                  });
                  // console.log(marker);
                  marker.addListener('click', function () {
                      infowindow.open($scope.map, marker);
                  });
                  // console.log(marker);
                  itemMarkers.push(marker);
                  // console.log(itemMarkers);
                  // putOnMap($scope.map);
                }

                // function putOnMap(map) {
                //     for (var i = 0; i < itemMarkers.length; i++) {
                //         itemMarkers[i].setMap(map);
                //     }
                // }

                $scope.markerFilter = function (input, checked) {
                    for (var i = 0; i < itemMarkers.length; i++) {
                        if (itemMarkers[i].category.toUpperCase() == input.toUpperCase() && checked) {
                            itemMarkers[i].setVisible(true);
                        }
                        else if (itemMarkers[i].category.toUpperCase() != input.toUpperCase() && checked) {
                            itemMarkers[i].setVisible(false);
                        }
                        else if (itemMarkers[i].category.toUpperCase() != input.toUpperCase() && !checked) {
                            itemMarkers[i].setVisible(true);
                        }
                        else if (itemMarkers[i].category.toUpperCase() == input.toUpperCase() && !checked){
                          itemMarkers[i].setVisible(false);
                        }
                    }
                }

                $scope.showDetail = function (e, marker) {
                    $scope.marker = marker;
                    $scope.map.showInfoWindow('mapPageIW', marker.id);
                };

            });
        }, function myError(response) {
            console.log("Error");
        });
    }]);
