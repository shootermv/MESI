'use strict';

/* Controllers */

angular.module('Mesi').controller('NavCtrl',
['$rootScope', '$scope', '$location', 'Auth', function($rootScope, $scope, $location, Auth) {
    $scope.user = Auth.user;
    $scope.userRoles = Auth.userRoles;
    $scope.accessLevels = Auth.accessLevels;

    $scope.logout = function() {
        Auth.logout(function() {		    
            $location.path('/login');
        }, function() {
            $rootScope.error = "Failed to logout";
        });
    };
}]);

angular.module('Mesi').controller('LoginCtrl',
['$rootScope', '$scope', '$location', '$window', 'Auth', function($rootScope, $scope, $location, $window, Auth) {

    $scope.rememberme = true;
    $scope.login = function() {
        Auth.login({
                username: $scope.username,
                password: $scope.password,
                rememberme: $scope.rememberme
            },
            function(res) {
                if(res.role.title=='admin')
					$location.path('/admin');
				else
				   $location.path('/private');
            },
            function(err) {
			    console.log('login error',err)
                $rootScope.error = "Failed to login";
            });
    };

    $scope.loginOauth = function(provider) {
        $window.location.href = '/auth/' + provider;
    };
}]);

angular.module('Mesi').controller('HomeCtrl',
['$rootScope','Auth','$location', function($rootScope, Auth, $location) {
				
	if(Auth.user.role.title=='admin'){				   
		$location.path('/admin');
	}
	else{
		$location.path('/private');
	}
}]);

angular.module('Mesi').controller('RegisterCtrl',
['$rootScope', '$scope', '$location', 'Auth', function($rootScope, $scope, $location, Auth) {
    $scope.role = Auth.userRoles.user;
    $scope.userRoles = Auth.userRoles;

    $scope.register = function() {
        Auth.register({
                username: $scope.username,
                password: $scope.password,
                role: $scope.role
            },
            function() {
                $location.path('/');
            },
            function(err) {
                $rootScope.error = err;
            });
    };
}]);

angular.module('Mesi').controller('PrivateCtrl',
['$rootScope', '$scope', 'Tasks', 'TasksRes', 'Socket', function($rootScope, $scope, Tasks, TasksRes, Socket) {
    
    $scope.tasks;
    
	$scope.getUserTasks = function(){
		Tasks.getUserTasks(function(res){
		    console.log('success!!!')
			$scope.tasks= res;
		});	
	};
	
	$scope.tasks = TasksRes;
	
	$scope.updateTaskStatus = function(task){
		Tasks.updateTask(task,
		function(res){			
			//display success notification
			$rootScope.success = true;
			$rootScope.successmsg = 'status updated successfully';

			//must refresh al users task		                
			$scope.getUserTasks();

		},function(err) {
  
		});		
	};

	//when some task assigned by admin - user must immediately see it
    Socket.on('newtask', function (message) {
	  $scope.getUserTasks();
	  //play sound
		var audio = document.getElementById("sound");
		audio.load();
		audio.play();
	});

	
	//$scope.getUserTasks();
}]);

angular.module('Mesi').controller('AdminCtrl',
['$rootScope', '$scope', 'Users', 'Auth', 'Tasks', 'Socket', 'TasksRes', function($rootScope, $scope, Users, Auth, Tasks, Socket, TasksRes) {
    $scope.loading = true;
    $scope.userRoles = Auth.userRoles;
	$scope.users = [];
	$scope.unassignedTasks = [];

	
	$scope.users = TasksRes.users;
	$scope.unassignedTasks = TasksRes.unassignedTasks;  
	$scope.loading = false;
	
	
	$scope.removeUnassignedTask = function(task, index){	
		Tasks.removeUnassignedTask(task, function(task){
			console.log('success with remove unassigned task')
			$scope.unassignedTasks.splice(index,1)
	    },function(err) {
		    console.log('remove task failed');
	    })		
	};
	
    $scope.addTask = function(newtask){
        Tasks.addTask(newtask, function(task){
			$scope.unassignedTasks.push(task);
			$scope.newtask='';
			$scope.form.$setPristine();
	    },function(err) {
		    console.log('adding task failed')
	    })
	};
	
	$scope.editTask = function (task){
	  $scope.editedTask = task;	  
	};
	
	$scope.doneEditing = function (task) {
	   $scope.editedTask = null;
 
	   Tasks.updateTaskSummary(task, function(task){
	       console.log('editing done...')
	   },function(err) {
		   console.log('editing task failed')
	   })
	};	

    //when some user changes some task status - admin notified immediately
	Socket.on('status', function (taskmsg) {
		var user=null;
		angular.forEach($scope.users, function(_user, key) {
			if(_user._id == taskmsg.user._id){
				user = _user;
			}
		});
		var user_task = null;
		
		if(user){
			//console.log(user.name);
			//search for task:
			angular.forEach(user.tasks, function(usertask, key) {
				if(taskmsg.task.status.name == 'active' && usertask.status.name =='active'){
					usertask.status = {name:'new', id:'2'}
				}
				if(usertask._id == taskmsg.task._id){
					user_task = usertask;
				}
			});  

			if(user_task){
				console.log('old-'+user_task.status.name);
				console.log('new-'+taskmsg.task.status.name);  	
				
				user_task.status = 	taskmsg.task.status;	

				//play sound
				var audio = document.getElementById("sound");
				audio.load();
				audio.play();
			}		
		}	  
	});
	

	
	$scope.$watch('unassignedTasks', function (newVal, oldVal) { 	   
		//console.log('$scope.selectedUser'+$scope.selectedUser.name)
		if(!$scope.selectedUser || !$scope.selectedProgrammerTask)return;		
		if(newVal.length > oldVal.length){//some task dropped and will became unassigned
		   
			console.log('attention! trying to unassign task-')
			Tasks.unAssignTask({uid:$scope.selectedUser._id, taskId:$scope.selectedProgrammerTask._id},function(res){
				console.log('success with unassign task')
				$scope.selectedProgrammerTask=null;
				$scope.selectedUser=null;	  
			}, function(err) {
				$scope.selectedProgrammerTask=null;
				$scope.selectedUser=null;						
				$rootScope.error = "Failed to unassign task -";
				$scope.loading = false;					  
			});			  			  
		}else{
			alert(JSON.stringify(oldVal)+' new:' +JSON.stringify(newVal))
		}			
	},true);
	
    $scope.assignTask = function(user, task){
		$scope.selectedTask = task;
		$scope.dropedUser = user;
		
		//find index of task in unassigned tasks
		var index;
		for(var i=0 ; i < $scope.unassignedTasks.length ; i++ ){
			if($scope.unassignedTasks[i]._id === task._id ){
				index = i;
			}
		}
		//find user in users array:
		for(var i=0 ; i < $scope.users.length ; i++ ){
			//remove the task from unassigned tasks
			$scope.unassignedTasks.splice(index,1);
			//assign the task
		    if($scope.users[i]._id === user._id ){
				$scope.users[i].tasks.push(task);//will trigger watch of "users"
			}		
		}

	}
	
	$scope.$watch('users', function (newUsers, oldUsers) {
		if($scope.dropedUser && $scope.selectedTask ){
			console.log('attention! trying to assign task')
			//console.log('task '+ $scope.selectedTask._id +' to user '+ $scope.dropedUser.name);
			Tasks.assignTask({uid:$scope.dropedUser._id, taskId:$scope.selectedTask._id},function(res){
				console.log('task assigned successfully to user ' +$scope.dropedUser.name);
				$scope.selectedTask=null;
				$scope.dropedUser=null;		  
			}, function(err) {
				$scope.selectedTask=null;
				$scope.dropedUser=null;				  
				$rootScope.error = "Failed to assign task -";
				$scope.loading = false;					  
			});							
		}			
	},true);	
			
}]);