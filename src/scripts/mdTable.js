'use strict';

angular.module('md.data.table').directive('mdTable', mdTable);

function Hash() {
  var keys = {};

  this.equals = function (key, item) {
    return keys[key] === item;
  };

  this.get = function (key) {
    return keys[key];
  };

  this.has = function (key) {
    return keys.hasOwnProperty(key);
  };

  this.purge = function (key) {
    delete keys[key];
  };

  this.update = function (key, item) {
    keys[key] = item;
  };
}

function mdTable() {

  function compile(tElement, tAttrs) {
    tElement.addClass('md-table');

    if(tAttrs.hasOwnProperty('mdProgress')) {
      var body = tElement.find('tbody')[0];
      var progress = angular.element('<thead class="md-table-progress">');

      if(body) {
        tElement[0].insertBefore(progress[0], body);
      }
    }


    var rows = tElement.find('tbody').find('tr');
    rows.attr('md-select-row', ''); //always add this attribute, use other attributes to control this directive

  }

  function Controller($attrs, $element, $q, $scope, $mdTable) {
    var self = this;
    var queue = [];
    var watchListener;
    var modelChangeListeners = [];


    self.$$hash = new Hash();
    self.$$columns = {};
    self.dirtyItems = [];

    self.rowUpdateCallback = $scope.$mdTable.rowUpdateCallback;

    self.isReady = {
        body: $q.defer(),
        head: $q.defer()
    };

    function enableRowSelection() {
      self.$$rowSelect = true;

      watchListener = $scope.$watchCollection('$mdTable.selected', function (selected) {
        modelChangeListeners.forEach(function (listener) {
          listener(selected);
        });
      });

      $element.addClass('md-row-select');
    }

    function disableRowSelection() {
      self.$$rowSelect = false;

      if(angular.isFunction(watchListener)) {
        watchListener();
      }

      $element.removeClass('md-row-select');
    }

    function resolvePromises() {
      if(!queue.length) {
        return $scope.$applyAsync();
      }

      queue[0]['finally'](function () {
        queue.shift();
        resolvePromises();
      });
    }

    function rowSelect() {
      return $attrs.mdRowSelect === '' || self.rowSelect;
    }

    function validateModel() {
      if(!self.selected) {
        return console.error('Row selection: ngModel is not defined.');
      }

      if(!angular.isArray(self.selected)) {
        return console.error('Row selection: Expected an array. Recived ' + typeof self.selected + '.');
      }

      return true;
    }

    self.columnCount = function () {
      return self.getRows($element[0]).reduce(function (count, row) {
        return row.cells.length > count ? row.cells.length : count;
      }, 0);
    };

    self.getRows = function (element) {
      return Array.prototype.filter.call(element.rows, function (row) {
        return !row.classList.contains('ng-leave');
      });
    };

    self.getBodyRows = function () {
      return Array.prototype.reduce.call($element.prop('tBodies'), function (result, tbody) {
        return result.concat(self.getRows(tbody));
      }, []);
    };

    self.getElement = function () {
      return $element;
    };

    self.getHeaderRows = function () {
      return self.getRows($element.prop('tHead'));
    };

    self.enableMultiSelect = function () {
      return $attrs.multiple === '' || $scope.$eval($attrs.multiple);
    };

    self.waitingOnPromise = function () {
      return !!queue.length;
    };

    self.queuePromise = function (promise) {
      if(!promise) {
        return;
      }

      if(queue.push(angular.isArray(promise) ? $q.all(promise) : $q.when(promise)) === 1) {
        resolvePromises();
      }
    };

    self.registerModelChangeListener = function (listener) {
      modelChangeListeners.push(listener);
    };

    self.removeModelChangeListener = function (listener) {
      var index = modelChangeListeners.indexOf(listener);

      if(index !== -1) {
        modelChangeListeners.splice(index, 1);
      }
    };

    if($attrs.hasOwnProperty('mdProgress')) {
      $scope.$watch('$mdTable.progress', self.queuePromise);
    }

    $scope.$watch(rowSelect, function (enable) {
      if(enable && !!validateModel()) {
        enableRowSelection();
      } else {
        disableRowSelection();
      }
    });

    // All for Editable
    if (!angular.isArray(self.dirtyItems)) {
        self.dirtyItems = [];
        // log warning for developer
        console.warn('md-row-dirty="' + $attrs.mdRowDirty + '" : ' +
            $attrs.mdRowDirty + ' is not defined as an array in your controller, ' +
            'i.e. ' + $attrs.mdRowDirty + ' = [], two-way data binding will fail.');
    }

    self.isReady.body.promise.then(function (ngRepeat) {
        if ($attrs.mdRowSelect && ngRepeat) {
            self.listener = $scope.$parent.$watch(ngRepeat.items, function (newValue, oldeValue) {
                if (newValue !== oldeValue) {
                    self.selectedItems.splice(0);
                    self.dirtyItems.splice(0);
                }
            });
        }
    });



    self.processEdit = function (rowData, propertyPath, propertyData, onError) {
        //remove duplicates
        $mdTable.removeDuplicates(self.dirtyItems, rowData.id);

        var oldItem = {};

        angular.copy(rowData, oldItem);

        //sync data
        $mdTable.updateObject(rowData, propertyPath, propertyData);

        //update dirty items
        self.dirtyItems.push({
            oldItem: oldItem,
            newItem: rowData
        });



        if (typeof self.rowUpdateCallback === 'function') {
            //execute the callback for each row
            var i = self.dirtyItems.length;
            while (i--) {
                var item = self.dirtyItems[i];

                (item, function () { //error callback
                    onError(item.oldItem);
                });

                self.dirtyItems.splice(i, 1); //remove the item from array
            }
        }
    };

    self.processEditSelect = function (rowData,oldItem,onError) {
        //remove duplicates
        $mdTable.removeDuplicates(self.dirtyItems, rowData.id);

        //update dirty items
        self.dirtyItems.push({
            oldItem: oldItem,
            newItem: rowData
        });

        // console.log('self.rowUpdateCallback', self.rowUpdateCallback);
        //call callback
        if (typeof self.rowUpdateCallback === 'function') {
            //execute the callback for each row
            var i = self.dirtyItems.length;
            while (i--) {
                var item = self.dirtyItems[i];

                self.rowUpdateCallback()(item, function () { //error callback
                    onError();
                });

                self.dirtyItems.splice(i, 1); //remove the item from array
            }
        }
    };
  }

  Controller.$inject = ['$attrs', '$element', '$q', '$scope', '$mdTable'];

  return {
    bindToController: true,
    compile: compile,
    controller: Controller,
    controllerAs: '$mdTable',
    restrict: 'A',
    scope: {
      progress: '=?mdProgress',
      selected: '=ngModel',
      rowSelect: '=mdRowSelect',
      // not sure
      rowUpdateCallback: '&mdRowUpdateCallback',
      rowClick: '=mdRowClick',
      hasAccess: '@'
    }
  };
}
