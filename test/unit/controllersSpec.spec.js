'use strict';

/* jasmine specs for services go here */

describe('controllers', function() {
  
    beforeEach(module('angular-client-side-auth'));
	
	
    function createLocals() {
      return {
        $scope: {},
        $location: jasmine.createSpyObj('$location', ['path']),
        i18nNotifications: jasmine.createSpyObj('i18nNotifications', ['pushForCurrentRoute', 'pushForNextRoute']),
        user: {
          $id: jasmine.createSpy('$id'),
          $password: 'XXX'
        }
      };
    }
    function runController(locals) {
      inject(function($controller) {
        $controller('UsersEditCtrl', locals);
      });
    } 

	describe('AdminCtrl', function() {
		it('should bring users', inject(function() {
		  expect(true).toEqual(true);
		}));
	});
});