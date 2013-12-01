'use strict';

/* jasmine specs for services go here */

describe('controllers', function() {
  
  beforeEach(module('angular-client-side-auth'));
  /*
    var mockBackend, Users, loader;
	beforeEach(inject(function('$rootScope', '$scope', 'Users', 'Auth', 'Tasks') {
		recipe = Recipe;
		mockBackend = _$httpBackend_;
		loader = MultiRecipeLoader;
	}));  */
  describe('AdminCtrl', function() {
    it('should bring users', inject(function() {
      expect(true).toEqual(true);
    }));
  });
});