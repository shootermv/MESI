'use strict';

/* jasmine specs for services go here */

describe('services', function() {
  beforeEach(module('angular-client-side-auth'));
  describe('version', function() {
    it('should return current version', inject(function() {
      expect(true).toEqual(true);
    }));
  });
});
