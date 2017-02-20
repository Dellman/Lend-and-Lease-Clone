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
        });

        $scope.prop = {
            "type": "select",
            "name": "Service",
            "value": "Books",
            "values": ['Books', 'Tools', 'Games', 'Others']
        };

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
                    "location": $scope.vm.map.getCenter()
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


