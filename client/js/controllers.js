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
['$rootScope', '$scope', 'Tasks', 'Socket', function($rootScope, $scope, Tasks, Socket) {
    
	//when some task assigned by admin - user must immediately see it
    Socket.on('newtask', function (message) {
	  $scope.getUserTasks();
	});

	$scope.getUserTasks = function(){
		Tasks.getUserTasks(function(res){
			$scope.tasks= res;
		});	
	};
	
	$scope.updateTaskStatus = function(task){
		Tasks.updateTask(task,
		function(res){			
			//display success notification
			$rootScope.success='status updated successfully';

			//must refresh al users task		                
			$scope.getUserTasks();

		},function(err) {
  
		});		
	};
	
	$scope.getUserTasks();
}]);

angular.module('Mesi').controller('AdminCtrl',
['$rootScope', '$scope', 'Users', 'Auth', 'Tasks', 'Socket',  function($rootScope, $scope, Users, Auth, Tasks, Socket) {
    $scope.loading = true;
    $scope.userRoles = Auth.userRoles;
	$scope.users = [];
	$scope.unassignedTasks = [];
	
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
			console.log('old-'+user_task.status.name);
			console.log('new-'+taskmsg.task.status.name);
			if(user_task)  user_task.status = 	taskmsg.task.status;		
		}	  
	});

	
    Tasks.getAllForAdmin(function(res) {	
        $scope.users = res.users;
		$scope.unassignedTasks = res.unassignedTasks;  
        $scope.loading = false;
		

		
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

    }, function(err) {
        $rootScope.error = "Failed to fetch users.";
        $scope.loading = false;
    });

}]);

