'use strict';

/* Controllers */

angular.module('MesiApp.controllers', []).
  controller('ProgrammerCtrl', ['$scope', '$routeParams', 'TasksOfProgrammer', function($scope, $routeParams, TasksOfProgrammer) {
        
  	     TasksOfProgrammer.get({programmerId: $routeParams.programmerId},function(tasksView){
  	     	$scope.tasks = tasksView.tasks;
  	     	$scope.programmer = tasksView.programmer;
  	     });
        

  }])
  .controller('TaskCtrl',  ['$scope', function(sc) {

	      sc.tasks = [
			{
				"id":1,
				"summary":"change title of check-details-popup widget",
				"module":"heck-details-popup",
				"text":"title of check-details-popup widget should be :'pipi kaki be tzeva chaki'",
				"createdate":"13/08/2013 17:04"
			},
			{
				"id":2,
				"summary":"take care of no-image at this path in check-details-popup widget gallery",
				"module":"heck-details-popup",
				"text":"instead of default 'image-not-found' icon -some custom image should displayed",
				"createdate":"11/08/2013 12:34"
			}
	     ];
	    
	  	 sc.programmers =[
			{
				"id":"1",
				"name":"Shlomo",
				"lname":"Ben Momo"		
			},
			{
				"id":"2",
				"name":"Moshe",
				"lname":"Vilner"		
			}
	  	 ];

	  	 sc.SaveTask=function(){
	  	 	var newtask={
				"id":5,
				"summary":"gogo",
				"module":"heck-details-popup",
				"text":"title of check-details-popup widget should be :'pipi kaki be tzeva chaki'",
				"createdate":"13/08/2013 17:04"
			};
	      sc.tasks.push(newtask);

             console.log($('a[data-dismiss="modal"]').length)
	  	 	$('[data-dismiss="modal"]').click()
	  	 }

  }]);