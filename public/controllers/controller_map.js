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
        }, function myError(response) {
            console.log("Error");
        });

        NgMap.getMap({id: 'mapViewMap'}).then(function (map) {
            $scope.map = map;
        });

        // Convert cords to readable format
        function geocodeCords(positionObject) {
            var geocoder = new google.maps.Geocoder;
            var namePos;
            var posLat = positionObject.position.lat();
            var posLng = positionObject.position.lng();

            var latlng = {lat: parseFloat(posLat), lng: parseFloat(posLng)};
            geocoder.geocode({'location': latlng}, function (results, status) {
                if (status === 'OK') {
                    if (results[1]) {
                        namePos = (results[1].formatted_address);
                        // console.log(this);
                        this.address = namePos;
                    } else {
                        window.alert('No results found');
                    }
                } else {
                    window.alert('Geocoder failed due to: ' + status);
                }
            });
        }

        // Store all markers
        // $scope.itemMarkers = [
        //     {
        //         id: 'foo',
        //         name: 'FOO SHOP',
        //         category: 'Book',
        //         subCategory: 'Horror',
        //         position: [59.93, 17.92],
        //         address: ''
        //     },
        //     {id: 'bar', name: 'BAR SHOP', category: 'Game', subCategory: 'Horror', position: [59.89, 17.9], address: ''}
        // ];

        // console.log($scope.itemMarkers);

        console.log($scope.items);

        $scope.showDetail = function (e, marker) {
            $scope.marker = marker;
            // geocodeCords(this);
            $scope.map.showInfoWindow('mapPageIW', marker.id);
        };
    }]);
