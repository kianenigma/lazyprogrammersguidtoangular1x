var myApp = angular.module('myApp', []);


myApp.factory("customInterceptor", function ($q) {
  return {
    request: function (config) {
      console.log('request : ', config);
      return config
    },
    response: function (response) {
      console.log('response', response);
      return response
    },
    responseError: function (response) {
      console.log('responseError', response);
      return $q.resolve(response);
    }
  }
})


myApp.config(function ($httpProvider) {
  $httpProvider.interceptors.push('customInterceptor');
})


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
        var httpPromise = $http({
            method: 'GET',
            url: 'https://api.github.com/users/' + n + '/repos',
          })
          .then(function (response) {
            $scope.reqStatus = 0;
            $scope.$broadcast("repo_update", {
              status: true,
              repos: response.data
            })
          }, function (err) {
            $scope.reqStatus = 2;
            $scope.$broadcast("repo_update", {
              status: true,
              repos: null
            })
          })
      } // end of if
    }) // end of $watch

});

myApp.controller('repoListCtrl', function ($scope, $rootScope) {
  $scope.repos = [];

  $rootScope.data = "root is here:|"

  $scope.$on('repo_update', function (evt, args) {
    console.log(args);
    if (args.status) {
      $scope.repos = args.repos;
    } else {
      $scope.repos = [];
    }
  })
})


myApp.filter('strRev', function () {
  return function (inp) {
    return inp.split('').reverse().join('')
  }
})
