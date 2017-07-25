'use strict';

/* jasmine specs for services go here */
//to add test statusPicker directive - V
//to add Test accessLevel directive - V
//to add test activeNav directive - V
//to add test cssnotification directive

describe('directives', function () {



	describe('status picker', function () {
		beforeEach(module('Mesi'));
		var scope, location, $compile, Tasks, elem, $rootScope;
		beforeEach(inject(function (_$compile_, _$rootScope_, $location, _Tasks_) {
			$rootScope = _$rootScope_
			location = $location
			$compile = _$compile_;
			Tasks = _Tasks_;
		}));

		fit('should had a btn-danger class (red) if status is new', function () {

			spyOn(Tasks, 'updateTask').and.callFake(function (args, callback, errcallback) {
				callback({ summary: 'blabla', status: { name: 'completed', id: 3 } });
			});

			scope = $rootScope.$new();
			//mocking the methods of the controller
			scope.getUserTasks = function () { }
			scope.updateTaskStatus = function (task) { }


			//get an element representation
			elem = angular.element("<status-picker></status-picker>");

			//create a new child scope
			scope.task = { status: { name: 'new', id: '2' } };

			//finally compile the HTML
			$compile(elem)(scope);

			//expect the background-color css property to be desirabe one
			expect(elem.attr("class")).toEqual('statuspckr btn-danger');
		});


		fit('if status is new, after clicking button it should became "active" and then "completed"', function () {

			spyOn(Tasks, 'updateTask').and.callFake(function (args, callback, errcallback) {
				callback({ summary: 'blabla', status: { name: 'completed', id: 3 } });
			});

			scope = $rootScope.$new();
			scope.updateTaskStatus = function (task) {
				//  scope.task =  task;
				//  console.log('new status:'+task.status.name)

			}

			var mySpy = spyOn(scope, 'updateTaskStatus').and.callThrough();


			scope.getUserTasks = function () { }
			//get an element representation
			elem = angular.element("<status-picker>{{task.status.name}}</status-picker>");

			//create a new child scope
			scope.task = { status: { name: 'new', id: '2' } };
			//finally compile the HTML
			$compile(elem)(scope);

			elem[0].click();
			expect(mySpy.calls.mostRecent().args[0]).toEqual({ status: { name: 'active', id: 1 } });
			elem[0].click();
			expect(mySpy.calls.mostRecent().args[0]).toEqual({ status: { name: 'completed', id: 3 } });
		});

	});

	describe('accessLevel', function () {
		var scope, location, $compile, Tasks, elem, $rootScope;
		var mockAuth = {
			user: { name: '', role: { bitMask: 1, title: "public" } },
			authorize: function () {
				return false;
			},
			isLoggedIn: function () {
				return false;
			}
		}

		var accessLevels = {
			"public": { "bitMask": 7, "title": "*" },
			"anon": { "bitMask": 1, "title": "public" },
			"user": { "bitMask": 6, "title": "admin" },//user & admin
			"admin": { "bitMask": 4, "title": "admin" },
			"useronly": { "bitMask": 2, "title": "user" }
		};
		beforeEach(module('Mesi'));
		beforeEach(module(function ($provide) {
			$provide.value('Auth', mockAuth);
			$provide.value('accessLevels', accessLevels);
		}));



		beforeEach(inject(function (_$compile_, _$rootScope_, $location, _Tasks_) {
			$rootScope = _$rootScope_
			location = $location
			$compile = _$compile_;
			Tasks = _Tasks_;
		}))

		fit('when user is public and access is public - the menu must be visible', function () {

			spyOn(mockAuth, 'authorize').and.returnValue(true)
			scope = $rootScope.$new();
			scope.accessLevels = accessLevels;

			var elem = $compile("<li data-access-level='accessLevels.public'>some text here</li>")(scope);

			//fire watch
			scope.$apply();

			expect(elem.css('display')).toEqual('');
		});


		fit('when user is public and access is user - the menu must be hidden', function () {

			scope = $rootScope.$new();
			scope.accessLevels = accessLevels;

			var elem = $compile("<li data-access-level='accessLevels.user'>some text here</li>")(scope);

			//fire watch
			scope.$apply();

			expect(elem.css('display')).toEqual('none');
		})
	});

	describe('activeNav', function () {
		var scope, location, compile, auth;
		beforeEach(module('Mesi'));
		beforeEach(module(function ($provide) {
			$provide.value('Auth', {
				authorize: function () { },
				isLoggedIn: function () { }
			});
		}));



		beforeEach(inject(function ($compile, $rootScope, $location) {
			scope = $rootScope.$new();
			location = $location
			compile = $compile;
		}));

		fit('when location is same as "href" of link - the link must be decorated with "active" class', function () {
			location.path('someurl');
			var elem = compile("<li data-active-nav ><a href='/someurl'>somelink</a></li>")(scope);

			//fire watch
			scope.$apply();
			expect(elem.hasClass('active')).toBe(true);
		});

		fit('when location is different from "href" of link - the "active" class must be removed', function () {
			location.path('some_different_url');
			//initially  decorated with 'active'
			var elem = compile("<li data-active-nav class='active'><a href='http://server/someurl'>somelink</a></li>")(scope);

			//fire watch
			scope.$apply();
			expect(elem.hasClass('active')).toBe(false);
		})
	})

	describe('cssnotification', function () {
		var scope, rootScope, compile, timeout;
		beforeEach(inject(function ($compile, $timeout, $rootScope) {
			rootScope = $rootScope;
			scope = $rootScope.$new();
			compile = $compile;
			timeout = $timeout;
		}));

		fit('Should be visible after rootScope.success became true', function () {

			var elem = compile('<div data-ng-bind="successmsg" ng-show="success" cssnotification></div>')(scope);
			rootScope.success = false;
			//'ng-hide' class means the element is hidden
			scope.$digest();
			expect(elem.hasClass('ng-hide')).toBe(true);


			//lets check if it shows up
			rootScope.success = true;
			rootScope.$digest();
			expect(elem.hasClass('ng-hide')).toBe(false);


			//lets check if it become hidden after 1 secs					
			/*timeout.flush(1001);
			expect(elem.hasClass('ng-hide')).toBe(true);
			timeout.verifyNoPendingTasks();*/
		});
		/*
		it('Text should be taken from $rootScope.successmsg', function() {	
            var elem = compile('<div data-ng-bind="successmsg" ng-show="success" cssnotification></div>')(scope);	
			rootScope.success = true;
			rootScope.successmsg = 'ha ha';
			//'ng-hide' class means the element is hidden
			scope.$digest(); 			
			expect(elem.text()).toEqual('ha ha');
        })
		*/
	})
});
