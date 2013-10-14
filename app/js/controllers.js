'use strict';

/* Controllers */

angular.module('MesiApp.controllers', []).
  controller('ProgrammerCtrl', ['$scope', '$routeParams', 'TasksOfProgrammer',  function($scope, $routeParams, TasksOfProgrammer) {        		
       
	  	TasksOfProgrammer.get({programmerId: $routeParams.programmerId},function(tasksView){
	  	     	$scope.tasks = tasksView.tasks;	  	     	
	  	     	$scope.programmer = tasksView.programmer;
	    });

	    $scope.newtask={summary:"",text:""}
       
		$scope.addTask = function( dismiss, newtask) {
		   
		    $scope.tasks.push($scope.newtask);
		    dismiss();
		  // $('#myModal').modal('hide');
		};

		$scope.MakeActive = function(task){
			//completed tasks cannot be active
			if(task.completed==true)return;
            //make other tasks to be unactive
            angular.forEach($scope.tasks, function(value, key){
            	value.isActive =false;
            });
			task.isActive =true;
		};

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