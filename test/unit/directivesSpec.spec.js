'use strict';

/* jasmine specs for services go here */
//to add test statusPicker directive - V
//to add Test accessLevel directive - V
//to add test activeNav directive
//to add test cssnotification directive

describe('directives', function() {
    var scope, elem;
	beforeEach(module('Mesi'));
	
	describe('status picker', function() {		
	    it('should had a btn-danger class (red) if status is new',inject(function($compile, $rootScope, Tasks) {		
			
			spyOn(Tasks, 'updateTask').andCallFake(function(args,callback,errcallback) {
				 callback({summary:'blabla',status:{name:'completed',id:3}});	
			});
		    	
		    scope = $rootScope.$new();
			//mocking the methods of the controller
	        scope.getUserTasks =function(){}
			scope.updateTaskStatus =function(task){}								
						
			
		    //get an element representation
		    elem = angular.element("<status-picker></status-picker>");
	 
		    //create a new child scope
		    scope.task = {status:{name:'new',id:'2'}};
	      
		    //finally compile the HTML
		    $compile(elem)(scope);
	 
		    //expect the background-color css property to be desirabe one
		    expect(elem.attr("class")).toEqual('statuspckr btn-danger');
		}));
		
		
	    it('if status is new, after clicking button it should became "active" and then "completed"',inject(function($compile, $rootScope, Tasks ) {
			
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
	
	describe('accessLevel', function() {		
        beforeEach(function() {
		
		    var mockAuth = {
				user :{ name:'', role:{bitMask: 1, title: "public"}},
				authorize:function(accessLevel, role){
					return accessLevel.bitMask & role.bitMask;
				}
			}
			
			var accessLevels = {
				"public":{"bitMask":7,"title":"*"},
				"anon":{"bitMask":1,"title":"public"},
				"user":{"bitMask":6,"title":"admin"},//user & admin
				"admin":{"bitMask":4,"title":"admin"},
				"useronly":{"bitMask":2,"title":"user"}
			};
							
		    module(function($provide) {
			    $provide.value('Auth', mockAuth);
				$provide.value('accessLevels', accessLevels);				
		    });
		})
	
		it('when user is public and access is public - the menu must be visible',inject(function($compile, $rootScope, accessLevels){
		

		    scope = $rootScope.$new();
			scope.accessLevels = accessLevels;

		    var elem = $compile("<li data-access-level='accessLevels.anon'>some text here</li>")(scope);
			
			//fire watch
			scope.$apply();
						
			expect(elem.css('display')).toEqual('');	
		}));
		
	
		it('when user is public and access is user - the menu must NOT be visible',inject(function($compile, $rootScope, accessLevels){		

		    scope = $rootScope.$new();
			scope.accessLevels = accessLevels;

		    var elem = $compile("<li data-access-level='accessLevels.user'>some text here</li>")(scope);
			
			//fire watch
			scope.$apply();
						
			expect(elem.css('display')).toEqual('none');	
		}))		
    });

	describe('activeNav', function() {


	})
});
