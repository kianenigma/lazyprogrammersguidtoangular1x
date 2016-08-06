var myApp = angular.module('myApp', []);


myApp.controller('mainCtrl', function ($scope) {
  $scope.Title = 'Chapter 4 starts now!';
  $scope.actors;

  $scope.sayHi = function () {
    alert('hello there')
  }

});
