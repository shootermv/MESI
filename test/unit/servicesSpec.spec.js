'use strict';

/* jasmine specs for services go here */

//to add Test for Auth   service - V
//to add Test for Users  service - V
//to add Test for Tasks  service - V
//to add Test for Socket service - V

describe('services', function() {
    var svc, httpBackend;
	
	beforeEach(module('Mesi'));	

	describe('Auth service', function() {
	    var authSvc,
        scope,
        cookieStoreSpy,
		httpBackend;
		
		beforeEach(function () {
		    //cookie mock
			cookieStoreSpy = jasmine.createSpyObj('CookieStore', ['get','remove']);
			cookieStoreSpy.get.andReturn({ name: "koko", role:{title:'admin',bitMask:4}});				 							
			cookieStoreSpy.remove(function(key) {})
			module(function($provide) {
				$provide.value('$cookieStore', cookieStoreSpy);
			});									
		});	
		beforeEach(inject(function($injector, Auth, $httpBackend) {
		    httpBackend = $httpBackend;
			authSvc = Auth;
		
		}));

        
		it('should bring some user in currentUser variable', function() {
			httpBackend.expectPOST('/login').respond({});
			httpBackend.expectPOST('/register').respond({});
			httpBackend.expectPOST('/logout').respond({});
			
			expect(authSvc.user).toEqual({ name: "koko", role:{title:'admin',bitMask:4}});
		})
	});
	
    describe('Users service', function() {
		beforeEach(inject(function($injector, Users, $httpBackend) {
			svc = Users;
			httpBackend = $httpBackend
		}));
	    afterEach(function() {
		    httpBackend.verifyNoOutstandingExpectation();
		    httpBackend.verifyNoOutstandingRequest();
	    });
		
		it('should have a get function', function() {
			expect(angular.isFunction(svc.getAll)).toBe(true);
		});
		
		it('should bring all the users', function() {
			   var returnData = { excited: true };				
				//expectGET to make sure this is called once.
				
				httpBackend.expectGET('/users').respond(returnData);
				var result;
				//create an object with a functio to spy on.
				var test = {
				    handler: function(data) {
				       // console.log('test.handler called')
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
	
	describe('Tasks service', function() {
		beforeEach(inject(function($injector, Tasks, $httpBackend) {
			svc = Tasks;
			httpBackend = $httpBackend;
		}));
		afterEach(function() {
		    httpBackend.verifyNoOutstandingExpectation();
		    httpBackend.verifyNoOutstandingRequest();
	    });
		it('should bring all the tasks', function() {
				var returnData = [{ summary: 'some task here...' }];
				httpBackend.expectGET('/tasks').respond(returnData);
				var result;
				//create an object with a functio to spy on.
				var test = {
				    handler: function(data) {				       
						result = data
				    }
				};				
				//make the call.
			    svc.getUserTasks(test.handler);
				
				//flush the backend to "execute" the request to do the expectedGET assertion.
				httpBackend.flush();
				
			    expect(result).toEqual(returnData);
		});
	});

	describe('Socket service', function() {
	    var $rootScope, svc, ioSpy;
		window.io = {
		                connect:function(){ 
							return { 
							  on:function(eventname ,callback){
								   callback('koko');
							  }
							} 
					    }
					};
		

		beforeEach(inject(function($rootScope,  Socket) {
				
			$rootScope = $rootScope.$new();
			svc = Socket;
			
			
		}));	
		afterEach(function() {
			httpBackend.verifyNoOutstandingExpectation();
			httpBackend.verifyNoOutstandingRequest();
	    });
		it('should respond to "ON"', function() {
		   var result;
		   svc.on('shlomo',function(somevalue){
			 result = somevalue
		   });
		   expect(result).toEqual('koko')			
		})
	})
});
