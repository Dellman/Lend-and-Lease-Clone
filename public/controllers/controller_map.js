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
            }).then(function(){
              var itemMarkers = [];

              function removeMarkers(map) {
                  putOnMap(null);
                  for (var i = 0; i < itemMarkers.length; i++) {
                      itemMarkers[i].setMap(null);
                  }
                  itemMarkers = [];
                  itemMarkers.length = 0;
                  console.log("Called");
              }

              removeMarkers($scope.map);

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
                    // sub-category: item.sub_category,
                    description: item.description,
                });
                // console.log(itemMarkers);
                itemMarkers.push(marker);
                putOnMap($scope.map);
              }

              function putOnMap(map) {
                  for (var i = 0; i < itemMarkers.length; i++) {
                      itemMarkers[i].setMap(map);
                      // console.log(itemMarkers[i]);
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
