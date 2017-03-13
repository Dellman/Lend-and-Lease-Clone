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
              var searchBar = document.getElementById("userSearch");

              console.log($scope.items);

              for (var i = 0; i < $scope.items.length; i++) {
                var latLngStr = $scope.items[i].location.split(',', 2);
                var markerLatLng = new google.maps.LatLng();
                markerLatLng.lat = parseFloat(latLngStr[0].trim());
                markerLatLng.lng = parseFloat(latLngStr[1].trim());
                $scope.items[i].location = markerLatLng;
                addMarker($scope.items[i]);
              }

              // If two markers have the same location, move it slightly
              // function editLoc(markerLoc){
              //   for (var i = 0; i < $scope.items.length; i++) {
              //     if ($scope.items[i].location.lat === $scope.items[i+1].location.lat && $scope.items[i].location.lng === $scope.items[i+1].location.lng) {
              //
              //     }
              //   }
              // }

              function addMarker(item) {
                var marker = new google.maps.Marker({
                    position: {lat: item.location.lat, lng: item.location.lng},
                    map: $scope.map,
                    name: item.item_name,
                    category: item.category,
                    subCategory: item.sub_category,
                    description: item.description,
                    image: item.img_link
                });
                // Popup window
                console.log(marker.image);
                var infowindow = new google.maps.InfoWindow({
                  content: "<h5>" + marker.name + "</h5>" +
                  "<h6>" + marker.category.toUpperCase() + "</h6>" +
                  // "<h6>" + marker.subCategory.toUpperCase() + "</h6>" +
                  "<p>" + marker.description + "</p>" +
                  "<div style='overflow:hidden'><img style='width: 225px; height:225px' src='localhost:3000/images/" + marker.image + "'/></div>"
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

              $scope.markerFilter = function(input, checked){
                for (var i = 0; i < itemMarkers.length; i++) {
                  if (itemMarkers[i].category.toUpperCase() == input.toUpperCase() && checked){
                      itemMarkers[i].setVisible(true);
                  }
                  else if(itemMarkers[i].category.toUpperCase() != input.toUpperCase() && checked){
                    itemMarkers[i].setVisible(false);
                  }
                  else if(itemMarkers[i].category.toUpperCase() != input.toUpperCase() && !checked){
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
