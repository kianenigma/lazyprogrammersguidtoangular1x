var myApp = angular.module('myApp', []);

myApp.controller('mainCtrl', function($scope, $interval){
  $scope.Title = 'Hello Angualr from data binding';

  $scope.alert = function() {
    alert("Yay!");
  }

  $interval(function() {$scope.Title = 'Hello Angualr from data binding at ' + new Date()})

  $scope.title = function() {
    return "Hello form a function";
  }

});
