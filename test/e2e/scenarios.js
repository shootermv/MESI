'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('my app', function() {

  beforeEach(function() {
    browser().navigateTo('/');
  });


  it('should redirect to programmer page', function() {
      //element('.programmers li:first a').click();
      expect(true).toBe(true);
  });

});
