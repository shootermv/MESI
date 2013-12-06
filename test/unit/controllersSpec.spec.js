'use strict';

/* jasmine specs for services go here */

describe('controllers', function() {
    var $rootScope, Tasks;
  
    beforeEach(module('angular-client-side-auth'));
	beforeEach(inject(function($injector) {
		$rootScope = $injector.get('$rootScope');
	}));
	//['$rootScope', '$scope', 'Users', 'Auth', 'Tasks', function($rootScope, $scope, Users, Auth, Tasks) {
	
    function createLocals() {
      return {
			$rootScope: $rootScope,
			$scope:  $rootScope.$new(),
			Users: {},
			Auth: {}, 
			Tasks:{		
				getAllForAdmin:function(callback){
				    
					
					callback({	users:[{name:'momo'}], unassignedTasks:[{summary:'taskkkk'}]});
					
				},
				addTask:function(tsk, callback, errcallack ){
					callback(tsk);
				},
				unAssignTask:jasmine.createSpy('unAssignTask')												
			}
        };
    }
    function runController(locals) {
      inject(function($controller) {
        $controller('AdminCtrl', locals);
      });
    } 
    
	describe('AdminCtrl', function() {
		
		it('Should bring users nad their tasks', inject(function() {
		    var locals = createLocals();
		    runController(locals);	


          			
		    expect(locals.$scope.users).toEqual([{name:'momo'}]);
		}));
		
		it('should make a call to Tasks.getAllForAdmin', function (){
			
			
		    var locals = createLocals();
			//set up the spy.
			spyOn(locals.Tasks, 'getAllForAdmin').andCallThrough();
		    				
			//make the call!
			runController(locals);
			
			//assert!
			expect(locals.Tasks.getAllForAdmin).toHaveBeenCalled();    
		});	
		
		it('Should add new task', inject(function() {
		    var locals = createLocals();
		    runController(locals);		
			//set up.
		    locals.$scope.unassignedTasks = [];
			
			//make the call.
			locals.$scope.addTask({summary:"haha"});
			
			//assert			
		    expect(locals.$scope.unassignedTasks).toEqual([{summary:"haha"}]);
		}));
       
	   // Test 3: Testing a $watch() 
	   
		it('should call Tasks.unAssignTasks when unassignedTasks is changed', function (){
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