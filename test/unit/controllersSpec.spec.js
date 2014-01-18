'use strict';

/* jasmine specs for services go here */

	//add Tests to Admin Controller       - V	
	//add Tests to NavCtrl Controller     - V
	//add Tests to LoginCtrl Controller   - V
	//add Tests to HomeCtrl Controller
	//add Tests to RegisterCtrl Controller
	//add Tests to PrivateCtrl Controller

describe('Controllers', function() {	
	beforeEach(module('Mesi'));
	
	//Admin
    describe('Admin', function() {
		var $rootScope, Tasks;
	  
		
		beforeEach(inject(function($injector) {
			$rootScope = $injector.get('$rootScope');
		})); 
				
		function createLocals() {
		  return {
				$rootScope: $rootScope,
				$scope:  $rootScope.$new(),
				Users: {},
				Auth: {}, 
				Tasks:{	//fake tasks service	
					getAllForAdmin:function(callback){				    				
						callback({	users:[{name:'momo'}], unassignedTasks:[{summary:'taskkkk'}]});					
					},
					addTask:function(tsk, callback, errcallack ){
						callback(tsk);
					},
					unAssignTask:jasmine.createSpy('unAssignTask')												
				},
				Socket:{
					on:function(name,callback){
					
					}
				}
			};
		}

		function runController(locals) {
		  inject(function($controller) {
			$controller('AdminCtrl', locals);
		  });
		} 
		
		describe('AdminCtrl', function() {
		    //initialization of controller
			it('Should bring users and their tasks', inject(function() {
				var locals = createLocals();
				runController(locals);							
				expect(locals.$scope.users).toEqual([{name:'momo'}]);
			}));
			
			//initialization of controller
			it('Initially should make a call to Tasks.getAllForAdmin', function (){			
				
				var locals = createLocals();
				//set up the spy.
				spyOn(locals.Tasks, 'getAllForAdmin').andCallThrough();
				//make call
				runController(locals);				
				//assert!
				expect(locals.Tasks.getAllForAdmin).toHaveBeenCalled();    
			});	

			//checks add task form
			it('the "add task" form should add new task', inject(function() {
				var locals = createLocals();
				runController(locals);		
				//set up.
				locals.$scope.unassignedTasks = [];
				//fake setPristine
				locals.$scope.form={$setPristine : function(){}};
				//make the call.
				locals.$scope.addTask({summary:"haha"});				
				//assert			
				expect(locals.$scope.unassignedTasks).toEqual([{summary:"haha"}]);
			}));
		   
		   // Test 3: Testing a $watch() 	   
			it('should call Tasks.unAssignTasks when unassignedTasks collection is changed', function (){
				var locals = createLocals();
				runController(locals);
				//fire watchers
				locals.$scope.$digest();
				
				locals.$scope.selectedUser ={};
				locals.$scope.selectedProgrammerTask={};
				
				//change unassignTasks
				locals.$scope.unassignedTasks.push({summary:'ooo'});
						
			   //$apply the change to trigger the $watch.
				locals.$scope.$apply();
				
				//assert
				expect(locals.Tasks.unAssignTask).toHaveBeenCalled();				
			});							
		});

    });
	
	
    //Private
	describe('NavCtrl', function() {
			var $rootScope, $httpBackend, $controller, NavCtrl, $scope, $location, Auth;
			
			beforeEach(inject(function($injector) {
				$httpBackend = $injector.get('$httpBackend');
				$rootScope = $injector.get('$rootScope');
				$scope = $rootScope.$new();
				$controller = $injector.get('$controller');
				
				$location = jasmine.createSpyObj('$location',['path']);
				//Auth = jasmine.createSpyObject('Auth');
				
				Auth = {
					user: {name : 'Shlomo'},
					userRoles:[],
					accessLevels:[{}],
					logout : function(callback){						
						callback();
					}
				};
				
				//spyOn(Auth, 'logout').re;
				
				NavCtrl = $controller('NavCtrl', {
					'$rootScope' : $rootScope,
					'$scope' : $scope,
					'$location':$location,
					'Auth':Auth
				});
				
			}));
		
		
			it('when logout pressed should redirect to logout ',function(){
			
			   expect($scope.user).toEqual({name:'Shlomo'});
			   expect($scope.userRoles).toEqual([]);
			   expect($scope.accessLevels).toEqual([{}]);
			   
			   $scope.logout();
			   expect($location.path).toHaveBeenCalledWith('/login');
			})
		});
 		
	describe('LoginCtrl', function() {
	    var $rootScope, $scope, $httpBackend, $controller, $location, $window, Auth;
		
		beforeEach(inject(function($injector) {
			$httpBackend = $injector.get('$httpBackend');
			$rootScope = $injector.get('$rootScope');
			$scope = $rootScope.$new();
			$controller = $injector.get('$controller');	
            $location = jasmine.createSpyObj('$location',['path']);	
			$window = jasmine.createSpyObj('$window',['location']);	
			
			
			Auth = {
				user: {name : 'Shlomo'},
				userRoles:[],
				accessLevels:[{}],
				login : function(params, callback){
					console.log('callback');
					callback({role:{title:'admin'}});
				}
			};
							
		
            //init the controller:
			$controller('LoginCtrl',{
			  '$rootScope':$rootScope,
			  '$scope':$scope,
			  '$location':$location,
			  '$window':$window,
			  'Auth':Auth
			});
			
		}));
		
		it('should redirect to /admin if user is admin',function(){
			  // expect($scope.user).toEqual({name:'Shlomo'});
			  // expect($scope.userRoles).toEqual([]);
			  // expect($scope.accessLevels).toEqual([{}]);
			   
			   $scope.login({});
			   expect($location.path).toHaveBeenCalledWith('/admin');			
		});
	})
});