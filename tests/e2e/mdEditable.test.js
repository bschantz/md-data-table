describe('md-editable', function() {
  var table;

  beforeEach(function(){
    browser.get(browser.params.baseUrl);
    table = element(by.id('md-data-table-1'));
  });




  it('should open a dialog box when clicking an editable item', function () {
    // $("#md-data-table-1 tbody tr td[md-editable='text']")
    var editableCell = element.all(by.css("#md-data-table-1 tbody tr:not([md-disable-select]) td[md-editable='text']")).first();
    editableCell.click().then(function(){
      browser.waitForAngular();
      var dialog = element(by.css('md-dialog'));

      expect(dialog.isPresent()).toBe(true);
    });

  });



  it('should NOT open a dialog box when clicking a NON editable item', function () {
    var nonEditableCell = element.all(by.css("#md-data-table-1 tbody tr td:not([md-editable])")).first();
    nonEditableCell.click().then(function(){
      browser.waitForAngular();
      var dialog = element(by.css('md-dialog'));

      expect(dialog.isPresent()).toBe(false);
    });
  });

  it('should NOT open a dialog box when clicking a NON editable item', function () {
    // the difference here is that we have the
    // md-editable-disabled="true" tag

    var nonEditableCell = element.all(by.css("#md-data-table-1 tbody tr td[md-editable-disabled='true']")).first();
    nonEditableCell.click().then(function(){
      browser.waitForAngular();
      var dialog = element(by.css('md-dialog'));

      expect(dialog.isPresent()).toBe(false);
    });
  });


  it('should update correctly the edited field', function () {
    var replacingText = "T_E_S_T";
    var editableCell = element.all(by.css("#md-data-table-1 tbody tr td[md-editable='text']")).first();
    var originalText;
    var dialog;

    editableCell.getText()
      .then(function(ot){originalText = ot; editableCell.click() })
      .then(function(){

        dialog = element(by.css('md-dialog'));
        dialog.element(by.model('editModel.data')).clear().sendKeys(originalText + replacingText);
      })
      .then(function(){

        // this doesn't look very right, we should have a better way to find the Save button
        dialog.element(by.css('button[aria-label="Save"]')).click();
      })
      .then(function(){
        browser.waitForAngular();

        expect(editableCell.getText()).toBe(originalText + replacingText);
      });

  });



  it('should NOT pdate correctly when the CANCEL button is clicked', function () {
    var replacingText = "T_E_S_T";
    var editableCell = element.all(by.css("#md-data-table-1 tbody tr td[md-editable='text']")).first();
    var originalText;
    var dialog;

    editableCell.getText()
      .then(function(ot){originalText = ot; editableCell.click() })
      .then(function(){

        dialog = element(by.css('md-dialog'));
        dialog.element(by.model('editModel.data')).clear().sendKeys(originalText + replacingText);
      })
      .then(function(){

        // this doesn't look very right, we should have a better way to find the Save button
        dialog.element(by.css('button[aria-label="Cancel"]')).click();
      })
      .then(function(){
        browser.waitForAngular();

        // we expect the text to not change
        expect(editableCell.getText()).toBe(originalText);
      });
  });


  it('should call the right callback when the field is edited', function(){
    var rowUpdateCallback = table.evaluate('rowUpdateCallback');
    // TODO:
    // don't know how to test it
  });


  it('should not allow to update a non valid field (eg. length < minlength )', function(){
    // TODO:
    // don't know how to test it
  });




});
