'use strict';

angular.module('md.data.table').directive('mdHead', mdHead);

function mdHead($compile, $interpolate) {

  function compile(tElement) {
    tElement.addClass('md-head');

    function addMenuIcon(){
      //TODO
      // wait for https://github.com/angular/material/issues/8446
      // to implement dismiss
      var ths = tElement.children().children();
      var menuItems = [];

      angular.forEach(ths, function(el){
        var content = angular.element(el).html();
        var attributes = [];

        //TODO
        //check all combination cases
        if (!angular.element(el).attr('md:order:by') &&
            !angular.element(el).attr('md-order-by') &&
            !angular.element(el).attr('data-md-order-by')) {
              // skip if this field is not set to order
              return;
        }


        angular.forEach(angular.element(el)[0].attributes, function(attribute){
          attributes.push(attribute.name + "=" + '"' + attribute.value + '"');
        });

        // change tag name from tr to md-menu-item
        var t = $interpolate('<md-menu-item {{attrs}}>{{content}}</md-menu-item>')({attrs: attributes.join(" "), content: content})
        menuItems.push(t);
      });

      tElement.append('<tr md-row class="card-list-header">\
        <th>\
          <md-menu>\
            <md-button class="md-data-table-sort-by-icon" style="float: right;" ng-click="$mdOpenMenu($event)" aria-label="Sort by">\
            Sort by\
            </md-button>\
            <md-menu-content>\ '
              +  menuItems.join("") +
            '</md-menu-content>\
          </md-menu>\
        </th>\
      </tr>');
    }


    addMenuIcon();

    return postLink;
  }


  // empty controller to be bind scope properties to
  function Controller() {

  }

  function postLink(scope, element, attrs, tableCtrl) {
    // because scope.$watch is unpredictable
    var oldValue = new Array(2);


    scope.$watch(function(){ return tableCtrl.cardMode; }, function(newValue){
      angular.forEach(element.find('tr'), function(tr){
        if (tr.classList.contains('card-list-header')){
          // normal mode
          if (!newValue){ tr.className = (tr.className + ' ng-hide'); }
          // card mode
          else tr.className = tr.className.replace('ng-hide', '');

        }else {
          // normal mode
          if (!newValue){ tr.className = tr.className.replace('ng-hide', ''); }

          // card mode
          else tr.className = (tr.className + ' ng-hide');

        }
      });


    });

    function addCheckboxColumn() {
      element.children().prepend('<th class="md-column md-checkbox-column">');
    }

    function attatchCheckbox() {
      element.prop('firstElementChild').firstElementChild.appendChild($compile(createCheckBox())(scope)[0]);
    }

    function createCheckBox() {
      return angular.element('<md-checkbox>').attr({
        'aria-label': 'Select All',
        'ng-click': 'toggleAll()',
        'ng-checked': 'allSelected()',
        'ng-disabled': '!getSelectableRows().length'
      });
    }

    function detachCheckbox() {
      var cell = element.prop('lastElementChild').firstElementChild;

      if(cell.classList.contains('md-checkbox-column')) {
        angular.element(cell).empty();
      }
    }

    function enableRowSelection() {
      return tableCtrl.$$rowSelect;
    }

    function mdSelectCtrl(row) {
      return angular.element(row).controller('mdSelect');
    }

    function removeCheckboxColumn() {
      Array.prototype.some.call(element.find('th'), function (cell) {
        return cell.classList.contains('md-checkbox-column') && cell.remove();
      });
    }

    scope.allSelected = function () {
      var rows = scope.getSelectableRows();

      return rows.length && rows.every(function (row) {
        return row.isSelected();
      });
    };

    scope.getSelectableRows = function () {
      return tableCtrl.getBodyRows().map(mdSelectCtrl).filter(function (ctrl) {
        return ctrl && !ctrl.disabled;
      });
    };

    scope.selectAll = function () {
      tableCtrl.getBodyRows().map(mdSelectCtrl).forEach(function (ctrl) {
        if(ctrl && !ctrl.isSelected()) {
          ctrl.select();
        }
      });
    };

    scope.toggleAll = function () {
      return scope.allSelected() ? scope.unSelectAll() : scope.selectAll();
    };

    scope.unSelectAll = function () {
      tableCtrl.getBodyRows().map(mdSelectCtrl).forEach(function (ctrl) {
        if(ctrl && ctrl.isSelected()) {
          ctrl.deselect();
        }
      });
    };


    scope.$watchGroup([enableRowSelection, tableCtrl.enableMultiSelect], function (newValue) {
      if(newValue[0] !== oldValue[0]) {
        if(newValue[0]) {
          addCheckboxColumn();

          if(newValue[1]) {
            attatchCheckbox();
          }
        } else {
          removeCheckboxColumn();
        }
      } else if(newValue[0] && newValue[1] !== oldValue[1]) {
        if(newValue[1]) {
          attatchCheckbox();
        } else {
          detachCheckbox();
        }
      }

      angular.copy(newValue, oldValue);
    });
  }

  return {
    bindToController: true,
    compile: compile,
    controller: Controller,
    controllerAs: '$mdHead',
    require: '^^mdTable',
    restrict: 'A',
    scope: {
      order: '=?mdOrder',
      onReorder: '=?mdOnReorder'
    }
  };
}

mdHead.$inject = ['$compile', '$interpolate'];
