var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {
  var data = "Hello";
  $scope.submit = function(){
    console.log(data);
  }
  $http.get('198.211.126.133:8080').then(function(response){
          $scope.welcome = response.data;
  });
    // function ping(){
    //   console.log('test');
    //   $http.post('198.211.126.133:8080', data, config).then(successCallback, errorCallback);
    // }
// app.controller('myCtrl', function($scope) {
//   $scope.submit = function(){
//       var data = "Hello";
//       console.log('test');
//     }
    });
