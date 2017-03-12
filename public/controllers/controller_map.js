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
            $scope.vm = {};
            NgMap.getMap({id: 'mapViewMap'}).then(function (map) {
                $scope.vm.map = map;
            });
            console.log($scope.vm.map);
            var itemMarkers = [];

            for (var i = 0; i < $scope.items.length; i++) {
              var latLngStr = $scope.items[i].location.split(',', 2);
              var markerLatLng = new google.maps.LatLng();
              markerLatLng.lat = latLngStr[0];
              markerLatLng.lng = latLngStr[1];
              $scope.items[i].location = markerLatLng;
              addMarker($scope.items[i].location);
            }

        $scope.showDetail = function (e, marker) {
                $scope.marker = marker;
                $scope.map.showInfoWindow('mapPageIW', marker.id);
            };

            function addMarker(location) {
                var marker = new google.maps.Marker({
                    position: location,
                    map: $scope.map
                });
                itemMarkers.push(marker);
                putOnMap($scope.map);
            }

            function putOnMap(map) {
                for (var i = 0; i < itemMarkers.length; i++) {
                    itemMarkers[i].setMap(map);
                    // console.log(itemMarkers[i]);
                }
            }
        }, function myError(response) {
            console.log("Error");
        });
    }]);
