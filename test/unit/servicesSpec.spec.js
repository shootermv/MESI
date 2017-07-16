'use strict';

/* jasmine specs for services go here */

//to add Test for Auth   service - V
//to add Test for Users  service - V
//to add Test for Tasks  service - V
//to add Test for Socket service - V

describe('services', function () {
	var svc, httpBackend, cookieStoreSpy, usersSvc;

	//cookie mock
	cookieStoreSpy = jasmine.createSpyObj('CookieStore', ['get', 'remove']);
	cookieStoreSpy.get.and.returnValue({ name: "koko", role: { title: 'admin', bitMask: 4 } });
	cookieStoreSpy.remove(function (key) { })


	beforeEach(module('Mesi'));
	beforeEach(module(function ($provide) {
		$provide.value('$cookieStore', cookieStoreSpy);
	}));

	describe('Auth service', function () {
		var authSvc,
			scope,
			httpBackend;


		beforeEach(inject(function ($injector, Auth, $httpBackend) {
			httpBackend = $httpBackend;
			authSvc = Auth;
			httpBackend.expectPOST('/login').respond({});
			httpBackend.expectPOST('/register').respond({});
			httpBackend.expectPOST('/logout').respond({});
		}));


		fit('should bring some user in currentUser variable', function () {
			expect(angular.equals(authSvc.user.name, "koko")).toBe(true);
		})
	});

	describe('Users service', function () {
		beforeEach(inject(function ($injector, Users, $httpBackend) {
			usersSvc = Users;
			httpBackend = $httpBackend
		}));
		afterEach(function () {
			httpBackend.verifyNoOutstandingExpectation();
			httpBackend.verifyNoOutstandingRequest();
		});

		fit('should have a get function', function () {
			expect(angular.isFunction(usersSvc.getAll)).toBe(true);
		});

		fit('should bring all the users', function () {
			var returnData = { excited: true };
			//expectGET to make sure this is called once.

			httpBackend.expectGET('/users').respond(returnData);
			var result;
			//create an object with a functio to spy on.
			var test = {
				handler: function (data) {
					result = data
				}
			};

			//set up a spy for the callback handler.
			//spyOn(test, 'handler');

			//make the call.
			usersSvc.getAll(test.handler, function (er) { });

			//flush the backend to "execute" the request to do the expectedGET assertion.
			httpBackend.flush();

			//check your spy to see if it's been called with the returned value.  
			expect(result).toEqual(returnData);
		});
	});

	describe('Tasks service', function () {
		beforeEach(inject(function ($injector, Tasks, $httpBackend) {
			svc = Tasks;
			httpBackend = $httpBackend;
		}));
		afterEach(function () {
			httpBackend.verifyNoOutstandingExpectation();
			httpBackend.verifyNoOutstandingRequest();
		});
		fit('should bring all the tasks', function () {
			var returnData = [{ summary: 'some task here...' }];
			httpBackend.expectGET('/tasks').respond(returnData);
			var result;
			//create an object with a functio to spy on.
			var test = {
				handler: function (data) {
					result = data
				}
			};
			//make the call.
			svc.getUserTasks(test.handler, function (er) { });

			//flush the backend to "execute" the request to do the expectedGET assertion.
			httpBackend.flush();

			expect(result).toEqual(returnData);
		});
	});

	describe('Socket service', function () {
		var $rootScope, svc, ioSpy;
		window.io = {
			connect: function () {
				return {
					on: function (eventname, callback) {
						callback('koko');
					}
				}
			}
		};


		beforeEach(inject(function ($rootScope, Socket) {

			$rootScope = $rootScope.$new();
			svc = Socket;


		}));
		afterEach(function () {
			httpBackend.verifyNoOutstandingExpectation();
			httpBackend.verifyNoOutstandingRequest();
		});
		fit('should respond to "ON"', function () {
			var result;
			svc.on('shlomo', function (somevalue) {
				result = somevalue
			});
			expect(result).toEqual('koko')
		})
	})
});
