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
    .directive('file', function () {
        return {
            scope: {
                file: '='
            },
            link: function (scope, el, attrs) {
                el.bind('change', function (event) {
                    var file = event.target.files[0];
                    scope.file = file ? file : undefined;
                    scope.$apply();
                });
            }
        };
    })

    .controller('controller_add_item', ['$scope', '$http', 'NgMap', '$rootScope', function ($scope, $http, NgMap, $rootScope) {

        var categories = ['Books', 'Electronics', 'Games', 'Tools'];
        $scope.item = {}

        $scope.mainCategories = {
            "type": "select",
            "name": "Service",
            "value": "Choose One",
            "values": ["Choose One"]
        };
        $scope.batteryOptions = {
            "type": "select",
            "name": "Service",
            "value": "Choose One",
            "values": ["Choose One", "No Battery", "Rechargeable Battery", "AA", "AAA", "9V"]
        };
        $scope.ouOptions = {
            "type": "select",
            "name": "Service",
            "value": "Choose One",
            "values": ["Choose One", "Yes", "No"]
        };

        $scope.subCategories = {
            "type": "select",
            "name": "Service",
            "value": "Choose One",
            "values": {}
        };

        $scope.categoriesViews = {};

        categories.forEach(function (item, index) {
            $scope.mainCategories.values.push(item);
            $scope.categoriesViews[item] = false;
        });
        $scope.mainCategories.values.push('Others');


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

        $http({
            method: "GET",
            url: $rootScope.serverIP + "/subCategories",
            headers: {
                'Content-Type': "application/json"
            }
        }).then(function mySucces(response) {
            var allCats = response.data;
            console.log(allCats);
            for (var j = 0; j < allCats.length; j++) {
                $scope.subCategories.values[categories[j]] = [];
                $scope.subCategories.values[categories[j]].push('Choose One')
                for (var i = 0; i < allCats[j].length; i++) {
                    $scope.subCategories.values[categories[j]].push(allCats[j][i][Object.keys(allCats[j][i])[0]]);
                }
            }

        }, function myError(response) {

            alert("Error, response is: " + response.data);
        });

        function resetCategories() {
            for (var prop in $scope.categoriesViews) {
                if ($scope.categoriesViews.hasOwnProperty(prop)) {
                    $scope.categoriesViews[prop] = false;
                }
            }
        }

        $scope.valueChanged = function (cat) {
            resetCategories();
            $scope.categoriesViews[cat] = true;
            $scope.subCategories.value = "Choose One"

        }
        //----------------------------------

        $scope.vm = {};
        NgMap.getMap({id: 'addItemMap'}).then(function (map) {
            $scope.vm.map = map;
            //setupListener($scope.map, 'click');
        });
        console.log($scope.map);
        // Global variables
        var locationInput = document.getElementById('locationInputText');
        var posLat;
        var posLng;
        var cordsPos;
        var namePos;
        var itemMarkers = [];

        function addMarker(location) {
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

        function putOnMap(map) {
            for (var i = 0; i < itemMarkers.length; i++) {
                itemMarkers[i].setAnimation(google.maps.Animation.DROP);
                itemMarkers[i].setMap(map);
                console.log(itemMarkers[i]);
            }
        }

        function removeMarkers(map) {
            putOnMap(null);
            for (var i = 0; i < itemMarkers.length; i++) {
                itemMarkers[i].setMap(null);
            }
            itemMarkers = [];
            itemMarkers.length = 0;
        }

        // Convert cords to readable format
        function geocodeCords(positionObject) {
            var geocoder = new google.maps.Geocoder;
            // console.log(positionObject);
            posLat = positionObject.lat;
            posLng = positionObject.lng;
            // console.log(positionObject);
            cordsPos = posLat + ", " + posLng;
            // var latlngStr = cordsPos.split(',', 2);
            // var latlng = {lat: parseFloat(posLat), lng: parseFloat(posLng)};
            // console.log(latlng);
            // cordsPos = positionObject;
            geocoder.geocode({'location': positionObject}, function (results, status) {
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
        $scope.getCurLoc = function () {
            // Try HTML5 geolocation.
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    geocodeCords(pos);
                });
            }
        }

        $scope.checkLoc = function () {
            // Google geocoder
            var geocoder = new google.maps.Geocoder;
            geocoder.geocode({'address': locationInput.value}, function (results, status) {
                if (status === 'OK') {
                    $scope.map.setCenter(results[0].geometry.location);
                    posLat = results[0].geometry.location.lat();
                    posLng = results[0].geometry.location.lng();
                    // cordsPos = posLat + ", " + posLng;
                } else {
                    alert('Geocode was not successful for the following reason: ' + status);
                }
                addMarker(results[0].geometry.location);
            });
        }

        $scope.submit = function () {

            var date2 = new Date();
            var date4 = date2.getFullYear() + '-' + date2.getMonth() + '-' + date2.getDate();

            var data = {
                "item_name": (($scope.item.name != null) ? $scope.item.name : "Empty"),//$scope.item.name,
                "description": (($scope.item.desc != null) ? $scope.item.desc : "Empty"),
                "category": (($scope.mainCategories.value != "Choose One") ? $scope.mainCategories.value : "Others"),
                "start_date": $("#reportrange_right").data('daterangepicker').startDate.format('YYYY-MM-DD'),
                "end_date": $("#reportrange_right").data('daterangepicker').endDate.format('YYYY-MM-DD'),
                "submission_date": date4,
                "location": cordsPos
            }
            if ($scope.mainCategories.value == "Books") {
                data.author = $scope.book.author;
                data.ISBN = $scope.book.isbn;
                data.book_category_id = $scope.subCategories.value;
                data.date_published = $scope.book.year;
            }
            else if ($scope.mainCategories.value == "Electronics") {
                data.battery = $scope.batteryOptions.value;
                data.electronics_category_id = $scope.subCategories.value;
                data.brand = $scope.elec.brand;
                data.outside_use = $scope.ouOptions.value;
            }
            else if ($scope.mainCategories.value == "Games") {
                data.gamestudio = $scope.games.studio;
                data.date_released = $scope.games.year;
                data.platform = $scope.games.platform;
                data.game_category_id = $scope.subCategories.value;
            }
            else if ($scope.mainCategories.value == "Tools") {
                data.tool_category_id = $scope.subCategories.value;
            }

            console.log(data)
            //console.log($scope.item.image);

            console.log($scope.file)

            $http({
                method: 'POST',
                url: $rootScope.serverIP + "/upload",
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                data: {
                    upload: $scope.file
                },
                transformRequest: function (data, headersGetter) {
                    var formData = new FormData();
                    angular.forEach(data, function (value, key) {
                        formData.append(key, value);
                    });

                    var headers = headersGetter();
                    delete headers['Content-Type'];

                    return formData;
                }
            })
                .success(function (data) {

                })
                .error(function (data, status) {

                });


            /*          $http({
             method: "POST",
             url: $rootScope.serverIP + "/additem",
             headers: {
             'Content-Type': "application/json"
             },
             data: data
             }).then(function mySucces(response) {
             console.log($scope.item.image);

             $http({
             method: "POST",
             url: $rootScope.serverIP + "/upload",
             headers: {

             },
             data: {
             file: $scope.item.image
             }
             }).then(function (response) {
             console.log("Success")
             console.log(response)
             }, function myError (response) {
             console.log("ErRor")
             console.log(response)
             })


             if (response.data.code == 101) {
             alert("Success, response is: " + response.data.message);
             }
             else {
             alert("ERROR: " + response.data.code + "MESSAGE: " + response.data.message);
             }
             }, function myError(response) {

             alert("Error, response is: " + response.data);
             });
             */
        };

    }]);
