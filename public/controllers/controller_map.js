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

    .controller('controller_map', ['$scope', '$http', 'NgMap', function ($scope, $http, NgMap) {

        NgMap.getMap({id: 'mapViewMap'}).then(function(map) {
         $scope.map = map;
        });

        // Convert cords to readable format
        function geocodeCords(item){
          var geocoder = new google.maps.Geocoder;
          var namePos;
          var posLat = item.position.lat();
          var posLng = item.position.lng();

          var latlng = {lat: parseFloat(posLat), lng: parseFloat(posLng)};
          geocoder.geocode({'location': latlng}, function(results, status) {
            if (status === 'OK') {
              if (results[1]) {
                namePos = (results[1].formatted_address);
                item.id = namePos;
                console.log(item);
              } else {
                window.alert('No results found');
              }
            } else {
              window.alert('Geocoder failed due to: ' + status);
            }
          });
        }
        // Store all markers
        $scope.mapMarkers = [
         {id:'foo', name: 'FOO SHOP', category:'Book', subCategory:'Horror', position:[59.93, 17.92], address: ''},
         {id:'bar', name: 'BAR SHOP', category:'Game', subCategory:'Horror',  position:[59.89, 17.9], address: ''}
        ];
        var markersArray = $scope.mapMarkers;

        $scope.showDetail = function(e, marker) {
          $scope.marker = marker;
          geocodeCords(this);
          $scope.map.showInfoWindow('mapPageIW', marker.id);
        };

        $http({
            method : "GET",
            url : "http://198.211.126.133:3000/items"
        }).then(function mySucces(response) {
            $scope.items = response.data;
        }, function myError(response) {
            alert("Error");
        });
    }]);
