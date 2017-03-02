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

    .controller('controller_add_item', ['$scope', '$http', 'NgMap', '$rootScope', function ($scope, $http, NgMap, $rootScope) {

        $("#search_bar").hide();

        //Date Picker
        var start = moment();//.subtract(29, 'days');
        var end = moment().add(29, 'days');

        function cb(start, end) {
            $('#reportrange_right span').html(start.format('DD MMMM, YYYY') + ' - ' + end.format('DD MMMM, YYYY'));
        }

        $('#reportrange_right').daterangepicker({
            startDate: start,
            endDate: end,
            ranges: {
                //'Today': [moment(), moment()],
                //'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Next 7 Days': [moment(), moment().add(6, 'days')],
                'Next 30 Days': [moment(), moment().add(29, 'days')],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Next Month': [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')]
            }
        }, cb);
        cb(start, end);
        //------------------------------------
        //Other Categories
        $scope.mainCategories = {
            "type": "select",
            "name": "Service",
            "value": "Choose One",
            "values": [ "Choose One", "Books", "Tools", "Games", "Electronics"]
        };
        $scope.subCategories = {
            "type": "select",
            "name": "Service",
            "value": "Choose One",
            "values": {
                'Books': ['Choose One', 'Fiction', 'Horror', 'Romance'],
                'Games': ['Choose One', 'Action', 'Shooters', 'Hack and Slash', 'RPG', 'Strategy', 'Simulation', 'Sport', 'Racing', 'Adventure'],
                'Tools': ['Choose One', 'Useful', 'Useless'],
                'Electronics': ['Choose One', 'Indoor', 'Outdoor']
            }
        };
        $scope.categoriesViews = {
            'Books': false,
            'Tools': false,
            'Games': false,
            'Electronics': false
        };
        function resetCategories(){
            for (var prop in $scope.categoriesViews) {
                if ($scope.categoriesViews.hasOwnProperty(prop)) {
                    $scope.categoriesViews[prop] = false;
                }
            }
        }
        $scope.valueChanged = function(cat){
            switch (cat){
                case 'Books':
                    resetCategories();
                    $scope.categoriesViews.Books = true;
                    break;
                case 'Tools':
                    resetCategories();
                    $scope.categoriesViews.Tools = true;
                    break;
                case 'Games':
                    resetCategories();
                    $scope.categoriesViews.Games = true;
                    break;
                case 'Electronics':
                    resetCategories();
                    $scope.categoriesViews.Electronics = true;
                    break;
            }
        }
        //----------------------------------


        $scope.vm = {};
        NgMap.getMap().then(function(map) {
            $scope.vm.map = map;
            //setupListener($scope.map, 'click');
        });

/*        $scope.prop = {
            "type": "select",
            "name": "Service",
            "value": "Books",
            "values": ['Books', 'Tools', 'Games', 'Others']
        };*/

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
  removeMarkers($scope.map);
  itemMarkers.push(marker);
  putOnMap($scope.map);
  $scope.map.setCenter(location);
  $scope.map.setZoom(18);
}

function putOnMap(map){
for (var i = 0; i < itemMarkers.length; i++) {
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

// Convert cords to readable format
function geocodeCords(positionObject){
var geocoder = new google.maps.Geocoder;
posLat = positionObject.lat;
posLng = positionObject.lng;
cordsPos = posLat + ", " + posLng;
console.log(cordsPos);

var latlngStr = cordsPos.split(',', 2);
var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
geocoder.geocode({'location': latlng}, function(results, status) {
  if (status === 'OK') {
    if (results[1]) {
      namePos = (results[1].formatted_address);
      locationInput.value = namePos;
      addMarker(positionObject);
    } else {
      window.alert('No results found');
    }
  } else {
    window.alert('Geocoder failed due to: ' + status);
  }
});
}

// Get User Location
$scope.getCurLoc = function() {
  // Try HTML5 geolocation.
  // Google geocoder
  // var geocoder = new google.maps.Geocoder;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      geocodeCords(pos);
    });
      }
    }

$scope.checkLoc = function(){
  // Google geocoder
  // var geocoder = new google.maps.Geocoder;
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
/*            alert("Name: " + $scope.item.name +
                ", desc: " + $scope.item.desc +
                ", cat: " + $scope.mainCategories.value +
                ", subCat: " + $scope.subCategories.value +
                ", start date: " + $("#reportrange_right").data('daterangepicker').startDate.format('YYYY-MM-DD') +
                ", end date: " + $("#reportrange_right").data('daterangepicker').endDate.format('YYYY-MM-DD') +
                ", submission date: " + new Date());*/
            /*
             To use the temporary server POST request, we need 2 things:
             1- Add the content-type: application/json header to the request
             2- Send in the body, the data as JSON object
             Also, the JSON file has to contain an array called items that has objects with name, desc, category keys
             */
            // var date1 = $scope.item.expDate;
            var date2 = new Date();
            // var date3 = date1.getFullYear() + '-' + date1.getMonth() + '-' + date1.getDate();
            var date4 = date2.getFullYear() + '-' + date2.getMonth() + '-' + date2.getDate();

            $http({
                method: "POST",
                url: $rootScope.serverIP + "/additem",
                headers: {
                    'Content-Type': "application/json"
                },
                data: {
                    "item_name": $scope.item.name,
                    "description": $scope.item.desc,
                    "category": $scope.mainCategories.value,
                    "start_date": $("#reportrange_right").data('daterangepicker').startDate.format('YYYY-MM-DD'),
                    "end_date": $("#reportrange_right").data('daterangepicker').endDate.format('YYYY-MM-DD'),
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
