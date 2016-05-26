angular.module('nutritionApp').controller('DessertFormDialogController', ['$mdDialog', '$controller', '$scope', 'nutritionService', function ($mdDialog, $controller, $scope, nutritionService) {
  'use strict';
  var $nutrition = $scope.$new();
  $controller('nutritionController', { $scope: $nutrition });

  $scope.getTypes = $nutrition.getTypes;

  $scope.cancel = $mdDialog.cancel;

  function success(dessert) {
    $mdDialog.hide(dessert);
  }

  $scope.addItem = function () {
    var nut = $nutrition;
    $scope.item.form.$setSubmitted();


    if($scope.item.form.$valid) {
      nutritionService.add($scope.dessert);
      $mdDialog.hide();
    }
  };

}]);
