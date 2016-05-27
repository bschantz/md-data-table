angular.module('nutritionApp').controller('DessertFormDialogController', ['$mdDialog', '$controller', '$scope', 'nutritionService', 'dessert', 'isEditing', function ($mdDialog, $controller, $scope, nutritionService, dessert, isEditing) {
  'use strict';
  var $nutrition = $scope.$new();
  $controller('nutritionController', { $scope: $nutrition });

  $scope.getTypes = $nutrition.getTypes;
  $scope.cancel = $mdDialog.cancel;
  $scope.dessert = dessert;
  $scope.isEditing = isEditing;


  function success(dessert) {
    $mdDialog.hide(dessert);
  }

  $scope.save = function(){
    var item = $scope.dessert;

    $scope.item.form.$setSubmitted();
    if(!$scope.item.form.$valid) return;

    if ($scope.isEditing){
      nutritionService.updateItem(item);
    } else {
      nutritionService.add(item);
    }
    $mdDialog.hide(item);
  }


}]);
