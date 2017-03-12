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
                //console.log(map);
            }).then(function(){
              //console.log($scope.vm.map);
              var itemMarkers = [];

              for (var i = 0; i < $scope.items.length; i++) {
                var latLngStr = $scope.items[i].location.split(',', 2);
                var markerLatLng = new google.maps.LatLng();
                markerLatLng.lat = parseFloat(latLngStr[0].trim());
                markerLatLng.lng = parseFloat(latLngStr[1].trim());
                // $scope.items[i].location.lat = markerLat;
                // $scope.items[i].location.lng = markerLng;
                $scope.items[i].location = markerLatLng;
                // console.log($scope.items[i].location);
                // console.log($scope.items[i].location.lat);
                // var markerLat = latLngStr[0].trim();
                // var markerLng = latLngStr[1].trim();
                // $scope.items[i].lat = markerLat;
                // $scope.items[i].lng = markerLng;
                addMarker($scope.items[i].location);
                // addMarker($scope.items[i].lat, $scope.items[i].lng)
              }

              $scope.showDetail = function (e, marker) {
                  $scope.marker = marker;
                  $scope.map.showInfoWindow('mapPageIW', marker.id);
              };

              function addMarker(location) {
                  // var loc = {lat: 59.5, lng: 17};
                  var loc = {lat: location.lat, lng: location.lng};
                  // loc.lat = location.lat;
                  // loc.lng = location.lng;
                  console.log(loc);
                  // console.log(loc2);
                  // console.log(location.lat);
                  // var loc = location;
                  // console.log(location);
                  // var myLatlng = new google.maps.LatLng(location.lat,location.lng);
                  // console.log(myLatlng);
                  // var markerLat = location.lat;
                  // var markerLng = location.lng
                  var marker = new google.maps.Marker({
                      // position: location,
                      position: loc,
                      // position: {lat: markerLat, lng: markerLng},
                      map: $scope.map
                  });
                  // itemMarkers.push(marker);
                  // console.log(marker);
                  // putOnMap($scope.map);
              }

              function putOnMap(map) {
                  for (var i = 0; i < itemMarkers.length; i++) {
                      itemMarkers[i].setMap(map);
                      // console.log(itemMarkers[i]);
                  }
              }
            });
        }, function myError(response) {
            console.log("Error");
        });
    }]);
