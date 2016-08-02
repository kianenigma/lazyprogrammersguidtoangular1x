var myApp = angular.module('myApp', []);

myApp.directive('titleEditor', function() {
  return {
    restrict: 'AE', // how this directive can be used. <attribute> and <element> in this case
    scope: {
      'parentTitle': '=title'
    }, // isolated scope
    template: '<h1> I Am poped inside from a directive! </h1>' +
      ' <p>{{ directiveData }}</p>' +
      '<p> i am $parent.Title : {{ $parent.Title }} </p>' +
      '<p> i am parentTitle : {{ parentTitle }} </p>' +
      '<input ng-model="parentTitle" type="text" />' ,
    controller: function($scope) {
        $scope.directiveData = "I Live inside the directive!";
        console.log($scope.$parent.Title);
        console.log($scope.parentTitle);
      }, // custom controller for this directive
    link: function(scope, iElem, iAttr, ctrl) {
      iElem.on('click', function(){
        console.log("clicked!");
      })
      console.log(scope, iElem, iAttr, ctrl);
    }
  }
})

myApp.controller('mainCtrl', function($scope, $interval, nameService) {
  $scope.Title = 'Hello Angualr from data binding';
  $scope.names = nameService.getNames();

  $scope.alert = function() {
    alert("Yay!");
  }

  $scope.onListItemClick = function(name) {
    alert(name);
  }

  $scope.title = function() {
    return "Hello form a function";
  }

});
// 
// myApp.factory("nameService", function() {
//   var names = ["Marshall", "Ted", "Barney", "Robin"];
//   var getNames = function() { return names }
//   var getName = function(idx) { return names[idx] }
//
//   return {
//     getName: getName,
//     getNames: getNames
//   }
// })

myApp.service('nameService', function() {
  this.names = ["Marshall", "Ted", "Barney", "Robin"];

  this.getNames = function() { return this.names }
  this.getName = function(idx) { return this.name[idx] }

})
