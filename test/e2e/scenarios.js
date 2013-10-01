'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('my app', function() {

  beforeEach(function() {
    browser().navigateTo('../../app/index.html');
  });


  it('should ....', function() {
      element('.programmers li:first a').click();
      expect(browser().location().url()).toBe('/programmer/1');
  });

});
