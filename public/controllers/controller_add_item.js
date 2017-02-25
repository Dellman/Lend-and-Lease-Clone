/**
 * Created by Basel on 2/15/2017.
 */

angular.module('myApp.add_item', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/addItem', {
            templateUrl: 'views/add_item.html',
            controller: 'controller_add_item'
        });
    }])

    .controller('controller_add_item', ['$scope', '$http', 'NgMap', function ($scope, $http, NgMap) {

        $scope.vm = {};
        NgMap.getMap().then(function(map) {
            $scope.vm.map = map;
            //setupListener($scope.map, 'click');

        });

        $scope.prop = {
            "type": "select",
            "name": "Service",
            "value": "Books",
            "values": ['Books', 'Tools', 'Games', 'Others']
        };

/*
        function setupListener(map, name) {
            google.maps.event.addListener(map, name, function() {
                alert("I love you!" + map.get)
            });
        }
*/

      // Global variables
      var locationInput = document.getElementById('itemLoc');
      var posLat;
      var posLng;
      var cordsPos;
      var namePos;
      var itemMarkers = [];

      function addMarker(location){
        var marker = new google.maps.Marker({
          position: location,
          map: $scope.map
        });
      // Remove old marker(s) and add one and then zoom in
        console.log(itemMarkers.length);
        removeMarkers($scope.map);
        itemMarkers.push(marker);
        putOnMap($scope.map);
        $scope.map.setCenter(location);
        $scope.map.setZoom(18);
    }

    function putOnMap(map){
      for (var i = 0; i < itemMarkers.length; i++) {
        console.log(itemMarkers.length);
        itemMarkers[i].setAnimation(google.maps.Animation.DROP);
        itemMarkers[i].setMap(map);
      }
    }

    function removeMarkers(map){
      putOnMap(null);
      for (var i = 0; i < itemMarkers.length; i++) {
        itemMarkers[i].setMap(null);
      }
      itemMarkers = [];
      itemMarkers.length = 0;
    }


      // Get User Location
      $scope.getCurLoc = function() {
        // Try HTML5 geolocation.
        // Google geocoder
        var geocoder = new google.maps.Geocoder;
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
                posLat = pos.lat;
                posLng = pos.lng
                cordsPos = posLat + ", " + posLng;

                var latlngStr = cordsPos.split(',', 2);
                var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
                geocoder.geocode({'location': latlng}, function(results, status) {
                  if (status === 'OK') {
                    if (results[1]) {
                      namePos = (results[1].formatted_address);
                      locationInput.value = namePos;
                      addMarker(pos);
                    } else {
                      window.alert('No results found');
                    }
                  } else {
                    window.alert('Geocoder failed due to: ' + status);
                  }
                });
            });
          }
      }

      $scope.checkLoc = function(){
        // Google geocoder
        var geocoder = new google.maps.Geocoder;
       geocoder.geocode({'address': locationInput.value}, function(results, status) {
         if (status === 'OK') {
           $scope.map.setCenter(results[0].geometry.location);
           posLat = results[0].geometry.location.lat();
           posLng = results[0].geometry.location.lng();
           cordsPos = posLat + ", " + posLng;
         } else {
           alert('Geocode was not successful for the following reason: ' + status);
         }
         addMarker(results[0].geometry.location);
       });
      }

    function generateLocation(){

        var locE = 17.4 + Math.random() * 0.4 //17.4 to 17.8
        var locN = 59.6 + Math.random() * 0.4 //59.6 to 60
        return {pos:[40.11, -75.21],name:1}
        //{lat: 59.6, lng: 17.4}//"(" + locN + ", " + locE + ")";
    }

        $scope.submit = function () {
            /*
             To use the temporary server POST request, we need 2 things:
             1- Add the content-type: application/json header to the request
             2- Send in the body, the data as JSON object
             Also, the JSON file has to contain an array called items that has objects with name, desc, category keys
             */
            var date1 = $scope.item.expDate;
            var date2 = new Date();
            var date3 = date1.getFullYear() + '-' + date1.getMonth() + '-' + date1.getDate();
            var date4 = date2.getFullYear() + '-' + date2.getMonth() + '-' + date2.getDate();

            $http({
                method: "POST",
                url: "http://198.211.126.133:3000/additem",
                headers: {
                    'Content-Type': "application/json"
                },
                data: {
                    "item_name": $scope.item.name,
                    "description": $scope.item.desc,
                    "category": $scope.prop.value,
                    "expiration_date": date3,
                    "submission_date": date4,
                    // "location": generateLocation()
                    "location": cordsPos
                }
            }).then(function mySucces(response) {
                if (response.data.code == 101) {
                    alert("Success, response is: " + response.data.message);
                }
                else {
                    alert("ERROR: " + response.data.code + "MESSAGE: " + response.data.message);
                }
            }, function myError(response) {

                alert("Error, response is: " + response.data);
            });

        };
    }]);
