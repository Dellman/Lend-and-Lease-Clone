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
    .controller('controller_map', ['$scope', '$http', 'NgMap', '$rootScope', function ($scope, $http, NgMap, $rootScope) {

        $http({
            method: "GET",
            url: $rootScope.serverIP + "/loggedin",
            headers: {
                'Content-Type': "application/json"
            }
        }).then(function success(response) {
            console.log(response)
            if (response.data.code == 109) {
                document.querySelector('#sidebar-menu > div > ul > li:nth-child(2) > a').style.display = 'none';
                document.querySelector('#sidebar-menu > div > ul > li:nth-child(3) > a').style.display = 'none';
                document.querySelector('#sidebar-menu > div > ul > li:nth-child(4) > a').style.display = 'none';
            }
            else {
                document.querySelector('#sidebar-menu > div > ul > li:nth-child(2) > a').style.display = 'block';
                document.querySelector('#sidebar-menu > div > ul > li:nth-child(3) > a').style.display = 'block';
                document.querySelector('#sidebar-menu > div > ul > li:nth-child(4) > a').style.display = 'block';
            }

        }, function error() {
            alert("Error!")
        });

        $http({
            method: "GET",
            url: $rootScope.serverIP + "/items",
            headers: {
                'Content-Type': "application/json"
            }
        }).then(function mySucces(response) {
            $scope.items = response.data;

            NgMap.getMap({id: 'mapViewMap'}).then(function (map) {
                $scope.map = map;
            }).then(function () {

                console.log($scope.items)
                var itemMarkers = [];

                for (var i = 0; i < $scope.items.length; i++) {
                    var latLngStr = $scope.items[i].location.split(',', 2);
                    var markerLatLng = new google.maps.LatLng();
                    markerLatLng.lat = parseFloat(latLngStr[0].trim());
                    markerLatLng.lng = parseFloat(latLngStr[1].trim());
                    $scope.items[i].location = markerLatLng;
                    addMarker($scope.items[i]);
                }

                function addMarker(item) {
                    var marker = new google.maps.Marker({
                        position: {lat: item.location.lat, lng: item.location.lng},
                        map: $scope.map,
                        name: item.item_name,
                        category: item.category,
                        subCategory: item.sub_category,
                        description: item.description,
                        image: item.img_link,
                        id: item.item_id
                    });
                    // Popup window
                    // $scope.sendEmail = new function(marker){
                    function sendEmail() {
                        // console.log(maker.id);
                        // console.log("clicked");
                        alert(marker);
                    }

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
                        // "<a onclick='alert(" + marker.id + ");'>Send Request</a></div>"

                    });
                    marker.addListener('click', function () {
                        infowindow.open($scope.map, marker);
                    });
                    itemMarkers.push(marker);
                    putOnMap($scope.map);
                }

                function putOnMap(map) {
                    for (var i = 0; i < itemMarkers.length; i++) {
                        itemMarkers[i].setMap(map);
                    }
                }

                // $scope.markerFilter = function(){
                //   for (var i = 0; i < itemMarkers.length; i++) {
                //     var content = itemMarkers[i].name.toUpperCase() + " " + itemMarkers[i].description.toUpperCase() + " " + itemMarkers[i].category.toUpperCase();
                //     if (content.includes(searchBar.value.toUpperCase())) {
                //       itemMarkers[i].setVisible(true);
                //       console.log(content);
                //     }
                //     else{
                //       itemMarkers[i].setVisible(false);
                //       console.log(itemMarkers[i]);
                //     }
                //   }
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
                    }
                }

                $scope.showDetail = function (e, marker) {
                    $scope.marker = marker;
                    $scope.map.showInfoWindow('mapPageIW', marker.id);
                    console.log(this);
                };

            });
        }, function myError(response) {
            console.log("Error");
        });
    }]);
