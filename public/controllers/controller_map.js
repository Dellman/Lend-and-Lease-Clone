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

      $scope.vm = {};
        NgMap.getMap().then(function(map) {
         $scope.vm.map = map;
        });

        // $scope.vm.clicked = function() {
        //  alert('Clicked a link inside infoWindow');
        // };

        // Convert cords to readable format
        function geocodeCords(positionObject){
          var geocoder = new google.maps.Geocoder;
          var namePos;
          var posLat = positionObject.position.lat();
          var posLng = positionObject.position.lng();
          cordsPos = posLat + ", " + posLng;

          var latlngStr = cordsPos.split(',', 2);
          var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
          geocoder.geocode({'location': latlng}, function(results, status) {
            if (status === 'OK') {
              if (results[1]) {
                namePos = (results[1].formatted_address);
                // console.log(this);
                this.name = namePos;
                console.log("before:" + this.name);
              } else {
                window.alert('No results found');
              }
            } else {
              window.alert('Geocoder failed due to: ' + status);
            }
          });
        }

        $scope.vm.markers = [
         {id:'foo', name: 'FOO SHOP', category:'Book', subCategory:'Horror', address: '', position:[59.93, 17.92]},
         {id:'bar', name: 'BAR SHOP', category:'Game', subCategory:'Horror', address: '',  position:[59.89, 17.9]}
        ];
        // $scope.vm.marker = $scope.vm.markers[0];

        $scope.vm.showDetail = function(e, marker) {
          $scope.vm.marker = marker;
          geocodeCords(this);
          //  console.log(this.id);
          console.log("after:" + this.name);
          $scope.vm.map.showInfoWindow('IW', marker.id);
        };

        // $scope.vm.hideDetail = function() {
        //  $scope.vm.map.hideInfoWindow('foo-iw');
        // };

        $http({
            method : "GET",
            url : "http://198.211.126.133:3000/items"
        }).then(function mySucces(response) {
            $scope.items = response.data;
            // console.log($scope.items);
        }, function myError(response) {
            alert("Error");
        });


    }]);
