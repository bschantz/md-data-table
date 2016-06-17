angular.module('nutritionApp').controller('nutritionController', ['$http', '$mdMedia', '$mdEditDialog', '$q', '$timeout', '$scope', '$mdDialog', 'nutritionService', function ($http, $mdMedia, $mdEditDialog, $q, $timeout, $scope, $mdDialog, nutritionService) {
  'use strict';

  $scope.options = {
    rowSelection: true,
    multiSelect: true,
    autoSelect: true,
    decapitate: false,
    largeEditDialog: false,
    boundaryLinks: false,
    limitSelect: true,
    pageSelect: true,
    tableStriped: true
  };

  $scope.selected = [];
  $scope.dirtyItems = [];
  $scope.$mdMedia = $mdMedia;
  $scope.cardModeOn = function(){ return !$mdMedia('gt-sm'); }

  $scope.limitOptions = [5, 10, 15, {
    label: 'All',
    value: function () {
      return $scope.desserts ? $scope.desserts.count : 0;
    }
  }];

  $scope.query = {
    order: 'name',
    limit: 5,
    page: 1
  };

  $scope.nextPageInfiniteScroll = function(){
    // this is the most important part as it will control wether the infiniteScroll is working or not
    // we need to check if we are in cardMode, if so let's disable the infinite scroll
    if (!$scope.cardModeOn) return;

    console.log('next page');
    if ($scope.query.limit + 5 > $scope.desserts.count) return;
    $scope.query.limit += 5;
  }


  // for testing ngRepeat
  $scope.columns = [{
    name: 'Dessert',
    orderBy: 'name',
    unit: '100g serving'
  }, {
    descendFirst: true,
    name: 'Type',
    orderBy: 'type'
  },{
    name: 'Date',
    orderBy: 'date'
  }, {
    name: 'Calories',
    numeric: true,
    orderBy: 'calories.value'
  }, {
    name: 'Note',
    orderBy: 'note',
    trim: true
  }, {
    name: 'Fat',
    numeric: true,
    orderBy: 'fat.value',
    unit: 'g'
  },  {
    name: 'Carbs',
    numeric: true,
    orderBy: 'carbs.value',
    unit: 'g'
  },  {
    name: 'Protein',
    numeric: true,
    orderBy: 'protein.value',
    trim: true,
    unit: 'g'
  },  {
    name: 'Sodium',
    numeric: true,
    orderBy: 'sodium.value',
    unit: 'mg'
  }, {
    name: 'Calcium',
    numeric: true,
    orderBy: 'calcium.value',
    unit: '%'
  },  {
    name: 'Iron',
    numeric: true,
    orderBy: 'iron.value',
    unit: '%'
  }];

  $scope.desserts = nutritionService.desserts;

  $scope.editComment = function (event, dessert) {
    event.stopPropagation();

    var dialog = {
      modelValue: dessert.comment,
      placeholder: 'Add a comment',
      save: function (input) {
        dessert.comment = input.$modelValue;
      },
      targetEvent: event,
      title: 'Add a comment',
      validators: {
        'ng-required': true,
        'ng-minlength': 3,
        'md-maxlength': 30
      }
    };

    var promise = $scope.options.largeEditDialog ? $mdEditDialog.large(dialog) : $mdEditDialog.small(dialog);

    promise.then(function (ctrl) {
      var input = ctrl.getInput();

      input.$viewChangeListeners.push(function () {
        input.$setValidity('test', input.$modelValue !== 'test');
      });
    });
  };

  $scope.toggleLimitOptions = function () {
    $scope.limitOptions = $scope.limitOptions ? undefined : [5, 10, 15];
  };

  $scope.getTypes = function () {
    return ['Candy', 'Ice cream', 'Other', 'Pastry'];
  };

  $scope.onPaginate = function(page, limit) {
    console.log('Scope Page: ' + $scope.query.page + ' Scope Limit: ' + $scope.query.limit);
    console.log('Page: ' + page + ' Limit: ' + limit);

    $scope.promise = $timeout(function () {

    }, 2000);
  };

  $scope.deselect = function (item) {
    console.log(item.name, 'was deselected');
  };

  $scope.log = function (item) {
    console.log(item.name, 'was selected');
  };

  $scope.loadStuff = function () {
    $scope.promise = $timeout(function () {

    }, 2000);
  };

  $scope.onReorder = function(order) {

    console.log('Scope Order: ' + $scope.query.order);
    console.log('Order: ' + order);

    $scope.promise = $timeout(function () {

    }, 2000);
  };

  $scope.rowUpdateCallback = function (locals) {
    var oldItem = locals.oldItem;
    var newItem = locals.newItem;

    console.log('item', locals);
    // alert('row was updated\n' + JSON.stringify(newItem, null, ' '));
  };

  $scope.rowClick = function (item){
      alert('click:' + item);
  };

  $scope.toggleTable = function(){
      $scope.toggleContainer = !$scope.toggleContainer;
  };

  $scope.toggleContainer = false;


  //Creating an item
  $scope.addDessert = function (){
    $mdDialog.show({
        controller: 'DessertFormDialogController',
        templateUrl: 'templates/dessertFormDialog.html',
        locals: { dessert: undefined, isEditing: false },
        parent: angular.element(document.body),
        clickOutsideToClose: true
    }).then(function (result) {
      console.log('Created: ', result);
    }, function () {
        //cancelled
    });
  };

  //Editing an item
  $scope.editSelectedDessert = function(dessert){
    $mdDialog.show({
        controller: 'DessertFormDialogController',
        templateUrl: 'templates/dessertFormDialog.html',
        locals: {
          dessert: dessert,
          isEditing: true
        },
        parent: angular.element(document.body),
        clickOutsideToClose: true
    }).then(function (result) {
      console.log('Updated: ', result);
    }, function () {
        //cancelled
    });
  };

  $scope.deleteSelectedDessert = function(selectedItems){
    var items = selectedItems.slice();

    items.forEach(function (item){
      //deselect item
      $scope.selected.splice($scope.selected.indexOf(item), 1);

      //delete it
      nutritionService.deleteItem(item);
      console.log('selected after deleting', $scope.selected);
    });
  }

}]);
