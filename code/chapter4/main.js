var myApp = angular.module('myApp', []);


myApp.controller('mainCtrl', function ($scope) {
  $scope.Title = 'Chapter 4 starts now!';
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
