describe('mdEditable', function () {
  var element;
  var $scope;
  var controller;

  beforeEach(module('ngMaterial'));
  beforeEach(module('angularMoment'));
  beforeEach(module('ngMessages'));
  beforeEach(module('md.data.table'));
  beforeEach(module('md.table.templates'));

  beforeEach(inject(function ($compile, $rootScope){
    $scope = $rootScope;
    element = angular.element('<table data-md-table> \
        <tbody md-body> \
          <tr md-row> \
            <td md-cell md-editable="text" data="test">Row 1 - 1</td> \
            <td md-cell>Row 1 - 2</td> \
          </tr> \
        </tbody> \
      </table>');

    // element = angular.element('<td md-cell md-editable="text">asd</td>');

    $compile(element)($rootScope);
    // controller = element.controller("mdTable");
  }));


  // Tests
	it('sanity', function () {
    var result = 2;

    expect(result).toBe(2);
  });





});
