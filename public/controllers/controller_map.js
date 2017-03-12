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
            console.log($scope.items);
            
            NgMap.getMap({id: 'mapViewMap'}).then(function (map) {
                $scope.map = map;
            }).then(function(){

              console.log($scope.items);

              var itemMarkers = [];
              var searchBar = document.getElementById("userSearch");

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
                });
                var infowindow = new google.maps.InfoWindow({
                  content: "<h5>" + marker.name + "</h5>" +
                  "<h6>" + marker.category.toUpperCase() + "</h6>" +
                  // "<h6>" + marker.subCategory.toUpperCase() + "</h6>" +
                  "<p>" + marker.description + "</p>"
                });
                // console.log(itemMarkers);
                marker.addListener('click', function(){
                  infowindow.open($scope.map, marker);
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

              $scope.markerFilter = function(){
                // console.log(searchBar.value);
                // console.log(itemMarkers[0].name.includes(searchBar.value));
                for (var i = 0; i < itemMarkers.length; i++) {
                  if (itemMarkers[i].name.toUpperCase().includes(searchBar.value.toUpperCase()) ||
                    itemMarkers[i].description.toUpperCase().includes(searchBar.value.toUpperCase()) ||
                    itemMarkers[i].category.toUpperCase().includes(searchBar.value.toUpperCase())) {
                      itemMarkers[i].clickable = true;
                      itemMarkers[i].visible = true;
                  }
                  else{
                    itemMarkers[i].setVisible(false);
                    itemMarkers[i].clickable = false;
                    itemMarkers[i].visible = false;
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
