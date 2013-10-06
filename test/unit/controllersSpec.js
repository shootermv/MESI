'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function(){

  beforeEach(module('MesiApp.controllers'));
	  describe('ProgrammerCtrl', function(){
	    var scope, ctrl, $httpBackend;

	    beforeEach(module('MesiApp'));
	    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, $routeParams) {

	    	
	      $httpBackend = _$httpBackend_;
	      $httpBackend.expectGET('tasks/1.json').
	          respond({
			   "programmer":{
			     	  	 
						"id":"1",
						"name":"Shlomo",
						"lname":"Ben Momo"				  
			    },
				"tasks":[
					{
						"id":"3",
						"summary":"add validation to category-form",
						"module":"category-form",
						"text":"validation must validate fields as in spec",
						"createdate":"11/08/2013 11:34",
						"completed":false
					},
					{
						"id":"4",
						"summary":"write unit test",
						"module":"category-form",
						"text":"write unit test for checking form functionality",
						"createdate":"11/04/2013 10:32",
						"completed":true
					}		
				]	
			});
          
	      scope = $rootScope.$new();	 
	      $routeParams.programmerId = '1';     
	      ctrl = $controller('ProgrammerCtrl', {$scope: scope});
         /* */
	    }));


	    it('should display 2 tasks of programmer fetched from xhr', function() {
	      expect(scope.tasks).toBeUndefined();


	      
	      $httpBackend.flush();

	      expect(scope.tasks).toEqual([
					{
						"id":"3",
						"summary":"add validation to category-form",
						"module":"category-form",
						"text":"validation must validate fields as in spec",
						"createdate":"11/08/2013 11:34",
						"completed":false
					},
					{
						"id":"4",
						"summary":"write unit test",
						"module":"category-form",
						"text":"write unit test for checking form functionality",
						"createdate":"11/04/2013 10:32",
						"completed":true
					}		
			]);


	    });

	    /*
	    it('should set the default value of orderProp model', function() {
	      expect(scope.orderProp).toBe('age');
	    });
	    */
	  });




});
