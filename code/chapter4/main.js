var myApp = angular.module('myApp', []);


myApp.controller('mainCtrl', function ($scope, $timeout) {
  $scope.Title = 'Chapter 4 starts now!';

  // STYLE Manipulation
  $scope.btnDisplay = true;
  $scope.iconDisplay = false;

  $scope.doProcess = function () {
    $scope.iconDisplay = true;
    $timeout(function () { $scope.btnDisplay = false }, 3000);
  }

  $scope.actors = {
    "Ted": {
      lastName: "Mosbey",
      age: 27,
      bars: ["Blind Tiger", "Torst", "Good Beer"]
    },
    "Barney": {
      lastName: "Stinson",
      age: 30,
      bars: ["The Poney Bar"]
    }
  }

  $scope.sayHi = function () {
    alert('hello there');
  }



});
