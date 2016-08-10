var myApp = angular.module('myApp', []);


myApp.controller('mainCtrl', function ($scope, $timeout, $http) {
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
    },
    "Robin": {
      lastName: "Scherbatsky",
      age: 26,
      bars: ["Blind Tiger", "Torst", "Good Beer"]
    },
    "Lily": {
      lastName: "Aldrin",
      age: 27,
      bars: ["Blind Tiger", "Torst"]
    }
  }

  $scope.classes = ["btn-xs btn-danger"]

  $scope.sayHi = function () {
    alert('hello there');
  }

  // STYLE Manipulation
  $scope.btnDisplay = true;
  $scope.iconDisplay = false;

  $scope.doProcess = function () {
    $scope.iconDisplay = true;
    $timeout(function () { $scope.btnDisplay = false }, 3000);
  }
  $scope.classes = ["btn-xs btn-danger"]
    //

  // FORMS
  $scope.submit = function (form) {
    console.log(form);
    console.log(form.email.$error);
  }

  $scope.minpwd = 3;

  // HTTP

  // WATCH
  $scope.repos = [];
  $scope.reqStatus = 0;
  // 0 = success
  // 1 = req sent
  // 2 = error
  $scope.$watch("username", function (n, o) {
    if (n) {
      $scope.reqStatus = 1;
      $http({
          method: 'GET',
          url: 'https://api.github.com/users/' + n + '/repos',
        })
        .then(function (response) {
          $scope.reqStatus = 0;
          $scope.repos = response.data;
          console.log(response);
        }, function (err) {
          $scope.reqStatus = 2;
          $scope.repos = [];
          console.log("ERROR: ", err);
        })
    }
  })

});

myApp.filter('strRev', function () {
  return function (inp) {
    return inp.split('').reverse().join('')
  }
})
