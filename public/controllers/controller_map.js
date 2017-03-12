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
            url: $rootScope.serverIP + "/items",
            headers: {
                'Content-Type': "application/json"
            }
        }).then(function mySucces(response) {
            $scope.items = response.data;

            NgMap.getMap({id: 'mapViewMap'}).then(function (map) {
                $scope.map = map;
            });

            var itemMarkers = [];
            // var markerLatLng;

            for (var i = 0; i < $scope.items.length; i++) {
              var latLngStr = $scope.items[i].location.split(',', 2);
              // var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
              // console.log(latLngStr);
              // var markerLatLng = new google.maps.LatLng(parseFloat(latLngStr[0], parseFloat(latLngStr[1])));
              var markerLatLng = new google.maps.LatLng();
              markerLatLng.lat = latLngStr[0];
              markerLatLng.lng = latLngStr[1];
              // console.log(markerLatLng);
              $scope.items[i].location = markerLatLng;
              // console.log($scope.items[i].location);
              addMarker($scope.items[i].location);
            }

            // Convert cords to readable format
            function geocodeCords(position) {
                var geocoder = new google.maps.Geocoder;
                // var namePos;
                // var posLat = positionObject.position.lat();
                // var posLng = positionObject.position.lng();
                var latlngStr = position.split(',', 2);
                var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
                geocoder.geocode({'location': latlng}, function (results, status) {
                    if (status === 'OK') {
                        if (results[1]) {
                            namePos = (results[1].formatted_address);
                            // this.address = namePos;
                        } else {
                            window.alert('No results found');
                        }
                    } else {
                        window.alert('Geocoder failed due to: ' + status);
                    }
                });
            }

        $scope.showDetail = function (e, marker) {
                $scope.marker = marker;
                $scope.map.showInfoWindow('mapPageIW', marker.id);
            };

            function addMarker(location) {
              // console.log(location);
                var marker = new google.maps.Marker({
                    // position: {
                    //   lat: location[0],
                    //   lng: location[1]
                    // },
                    position: location,
                    map: $scope.map
                });
                console.log(marker.position);
                putOnMap($scope.map);
            }

            function putOnMap(map) {
                for (var i = 0; i < itemMarkers.length; i++) {
                    // $scope.items[i].setMap(map);
                    itemMarkers[i].setMap(map);
                    // console.log(itemMarkers[i]);
                }
            }

        }, function myError(response) {
            console.log("Error");
        });
    }]);
