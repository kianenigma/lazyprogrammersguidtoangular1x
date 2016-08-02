var myApp = angular.module('myApp', []);

myApp.directive('titleEditor', function () {
  return {
    restrict: 'AE', // how this directive can be used. <attribute> and <element> in this case
    scope: {
      'parentTitle': '=title'
    }, // isolated scope
    template: '<h1> I Am poped inside from a directive! </h1>' +
      ' <p>{{ directiveData }}</p>' +
      '<p> i am $parent.Title : {{ $parent.Title }} </p>' +
      '<p> i am parentTitle : {{ parentTitle }} </p>' +
      '<input ng-model="parentTitle" type="text" />',
    controller: function ($scope) {
      $scope.directiveData = "I Live inside the directive!";
      console.log($scope.$parent.Title);
      console.log($scope.parentTitle);
    }, // custom controller for this directive
    link: function (scope, iElem, iAttr, ctrl) {
      iElem.on('click', function () {
        console.log("clicked!");
      })
      console.log(scope, iElem, iAttr, ctrl);
    }
  }
})

myApp.controller('mainCtrl', function ($scope, $interval, actorService) {
  $scope.Title = 'Hello Angualr from data binding';
  $scope.actors = actorService.getactors();

  $scope.alert = function () {
    alert("Yay!");
  }

  $scope.onListItemClick = function (name) {
    alert(name);
  }

  $scope.title = function () {
    return "Hello form a function";
  }

});
//
// myApp.factory("actorService", function() {
//   var actors = ["Marshall", "Ted", "Barney", "Robin"];
//   var getActors = function() { return actors }
//   var getActor = function(idx) { return actors[idx] }
//
//   return {
//     getActors: getActors,
//     getActor: getActor
//   }
// })

myApp.service('actorService', function () {
  this.actors = ["Marshall", "Ted", "Barney", "Robin"];

  this.getActors = function () {
    return this.actors
  }
  this.getActor = function (idx) {
    return this.actors[idx]
  }

})
