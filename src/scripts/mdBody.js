'use strict';

angular.module('md.data.table').directive('mdBody', mdBody);

function mdBody($compile) {

  function compile(tElement) {
    tElement.addClass('md-body');

    return postLink;
  }

  function postLink(scope, element, attrs, tableCtrl) {
    // console.log('im here', tableCtrl.isInCardMode());
    console.log('mdTAble', tableCtrl);
    // console.log('is in cardmode', tableCtrl.isInCardMode());

    if (tableCtrl.cardMode){
      console.log('toggling');
      toggleInfiniteScroll(toggleInfiniteScroll);
    }


  // TODO:
  // not working, have to check how to compile all children
  console.log('tableCtrlScope', tableCtrl.cardMode);
    tableCtrl.scope.$watch(function(){ return tableCtrl.cardMode; }, function(newValue){
      console.log('watching', tableCtrl.cardMode);
      toggleInfiniteScroll(newValue); }, true);

    function toggleInfiniteScroll(newValue){
      console.log('cheguei')
      if (newValue == true){
        // infinite-scroll="nextPageInfiniteScroll()"
        console.log('aqui');
        element.attr('infinite-scroll', 'nextPageInfiniteScroll()');
        // $compile(element.contents())(scope);
        $compile(element)(scope);
      } else {
        // console.log('tirando');
        element.removeAttr('infinite-scroll');

        // $compile(element.contents())(scope)
      }

    }

  }


  return {
    compile: compile,
    require: '^mdTable',
    restrict: 'A'
  };
}

mdBody.$inject = ['$compile'];
