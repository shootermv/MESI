'use strict';

angular.module('angular-client-side-auth')
.factory('Auth', function($http, $cookieStore){

    var accessLevels = routingConfig.accessLevels
        , userRoles = routingConfig.userRoles
        , currentUser = $cookieStore.get('user') || { username: '', role: userRoles.public };
		
    
	//why to remove?
    $cookieStore.remove('user');

    function changeUser(user) {
        _.extend(currentUser, user);
    };

    return {
        authorize: function(accessLevel, role) {
            if(role === undefined)
                role = currentUser.role;

            return accessLevel.bitMask & role.bitMask;
        },
        isLoggedIn: function(user) {
            if(user === undefined)
                user = currentUser;
            return user.role.title == userRoles.user.title || user.role.title == userRoles.admin.title;
        },
        register: function(user, success, error) {
            $http.post('/register', user).success(function(res) {
                changeUser(res);
                success();
            }).error(error);
        },
        login: function(user, success, error) {
            $http.post('/login', user).success(function(user){
                changeUser(user);
                success(user);
            }).error(error);
        },
        logout: function(success, error) {
            $http.post('/logout').success(function(){
                changeUser({
                    username: '',
                    role: userRoles.public
                });
                success();
            }).error(error);
        },
        accessLevels: accessLevels,
        userRoles: userRoles,
        user: currentUser
    };
});

angular.module('angular-client-side-auth')
.factory('Users', function($http) {
    return {
        getAll: function(success, error) {
            $http.get('/users').success(success).error(error);
        }
    };
});

angular.module('angular-client-side-auth')
.factory('Tasks', function($http) {
    return {
        getAllForAdmin: function(success, error) {
            $http.get('/ForAdmin').success(success).error(error);						
        },
		getUserTasks: function(success, error) {
			$http.get('/tasks').success(success).error(error);	
		},
		unAssignTask:function(data ,success, error){
		    $http.get('/unAssignTask',{params:data}).success(success).error(error);	
			//console.log('data-',data)
		},
		assignTask:function(data ,success, error){
		    $http.get('/assignTask',{params:data}).success(success).error(error);	
			//console.log('data-',data)
		},
		addTask:function(newtask, success, error){
		
		    $http({method:'POST', url:'/addtask',data:newtask}).success(success).error(error);	
		},
		updateTask:function(task, success, error){
		    console.log('trying to  save status '+task.status);
			try{
			    $http({method:'PUT', url:'/task/'+task._id, data:task}).success(success).error(error);
			}catch(err){
				console.log(err)
			}
		}
    };
})
