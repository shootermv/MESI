'use strict';

/* jasmine specs for services go here */

describe('services', function() {
    var svc, httpBackend;
	beforeEach(module('angular-client-side-auth'));	
    describe('Users service', function() {
		beforeEach(inject(function($injector, Users, $httpBackend) {
			svc = Users;
			httpBackend = $httpBackend
		}));
	    afterEach(function() {
		    httpBackend.verifyNoOutstandingExpectation();
		    httpBackend.verifyNoOutstandingRequest();
	    });		   
				
		it('should bring all the users', function() {
			   var returnData = { excited: true };				
				//expectGET to make sure this is called once.
				
				httpBackend.expectGET('/users').respond(returnData);
				var result;
				//create an object with a functio to spy on.
				var test = {
				  handler: function(data) {
				        console.log('test.handler called')
						result = data
				  }
				};
				
				//set up a spy for the callback handler.
				//spyOn(test, 'handler');
				
				//make the call.
			    svc.getAll(test.handler);
				
				//flush the backend to "execute" the request to do the expectedGET assertion.
				httpBackend.flush();
				
				//check your spy to see if it's been called with the returned value.  
				expect(result).toEqual(returnData);
		});
    });
});
