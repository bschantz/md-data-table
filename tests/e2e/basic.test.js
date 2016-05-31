describe('md-data-table', function() {
    describe('Main page', function () {
        it('should have a correct title', function () {
            browser.get(browser.params.baseUrl);

            expect(browser.getTitle()).toBe('Responsive Material Design Data Table With Inline Editing');
        })
    });
});
