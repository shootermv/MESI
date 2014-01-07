'use strict';

/* jasmine specs for services go here */

describe('directives', function() {
    var scope, elem;
	beforeEach(module('angular-client-side-auth'));
	
	describe('status picker', function() {		
	    it('should had a btn-danger class (red) if status is new',inject(function($compile, $rootScope, Tasks) {		
			
			spyOn(Tasks, 'updateTask').andCallFake(function(args,callback,errcallback) {
				 callback({summary:'blabla',status:{name:'completed',id:3}});	
			});
		    	
		    scope = $rootScope.$new();
	        scope.getUserTasks =function(){}
			scope.updateTaskStatus =function(task){
			
			
			}
			
			
			
		    //get an element representation
		    elem = angular.element("<status-picker></status-picker>");
	 
		    //create a new child scope
		    scope.task = {status:{name:'new',id:'2'}};
	      
		    //finally compile the HTML
		    $compile(elem)(scope);
	 
		    //expect the background-color css property to be desirabe one
		    expect(elem.attr("class")).toEqual('statuspckr btn-danger');
		}));
		
		
	    it('if status is new, after clicking it should became "active"',inject(function($compile, $rootScope, Tasks ) {
			
			spyOn(Tasks, 'updateTask').andCallFake(function(args,callback,errcallback) {
				 callback({summary:'blabla',status:{name:'completed',id:3}});	
			});
			
			scope = $rootScope.$new();
			scope.updateTaskStatus =function(task){
			 //  scope.task =  task;
			 //  console.log('new status:'+task.status.name)
		
			}	
			
		    var mySpy = spyOn(scope, 'updateTaskStatus').andCallThrough();
			
			
	        scope.getUserTasks =function(){}
		    //get an element representation
		    elem = angular.element("<status-picker>{{task.status.name}}</status-picker>");
	 
		    //create a new child scope
		    scope.task = {status:{name:'new',id:'2'}};
		    //finally compile the HTML
		    $compile(elem)(scope);	

            elem[0].click();			
            expect(mySpy.mostRecentCall.args[0]).toEqual({status:{name:'active',id:1}});
            elem[0].click();			
            expect(mySpy.mostRecentCall.args[0]).toEqual({status:{name:'completed',id:3}});			
		}));		
	    
	});
	

	
});
