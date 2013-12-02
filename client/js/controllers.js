'use strict';

/* Controllers */

angular.module('angular-client-side-auth')
.controller('NavCtrl', ['$rootScope', '$scope', '$location', 'Auth', function($rootScope, $scope, $location, Auth) {
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

angular.module('angular-client-side-auth')
.controller('LoginCtrl',
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

angular.module('angular-client-side-auth')
.controller('HomeCtrl',
['$rootScope', function($rootScope) {

}]);

angular.module('angular-client-side-auth')
.controller('RegisterCtrl',
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

angular.module('angular-client-side-auth')
.controller('PrivateCtrl',
['$rootScope', '$scope', 'Tasks', function($rootScope, $scope, Tasks) {
    Tasks.getUserTasks(function(res){
		$scope.tasks= res;
	});
}]);


angular.module('angular-client-side-auth')
.controller('AdminCtrl',
['$rootScope', '$scope', 'Users', 'Auth', 'Tasks', function($rootScope, $scope, Users, Auth, Tasks) {
    $scope.loading = true;
    $scope.userRoles = Auth.userRoles;
	
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
	    },function(err) {
		    console.log('adding task failed')
	    })
	};
	
	
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
			}
			
              			
		},true);
		
		
		$scope.$watch('users', function (newUsers, oldUsers) {
		    if($scope.dropedUser && $scope.selectedTask){
				console.log('$scope.dropedUser.tasks',$scope.dropedUser.tasks,$scope.selectedTask);
				console.log(_.where($scope.dropedUser.tasks,{'_id': $scope.selectedTask._id}).length>0)
			}else{//starting to drag from use to unassign
			   console.log('$scope.selectedTask -must be null ', $scope.selectedTask)
			}
	        if($scope.dropedUser && $scope.selectedTask ){
				console.log('attention! trying to assign task')
				//console.log('task '+ $scope.selectedTask._id +' to user '+ $scope.dropedUser.name);
			    Tasks.assignTask({uid:$scope.dropedUser._id, taskId:$scope.selectedTask._id},function(res){
					console.log('task assigned successfully to user ' +$scope.dropedUser.name)
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

