'use strict';

angular.module('Mesi', ['ngCookies', 'ngRoute', 'btford.dragon-drop', 'ngAnimate'])

    .config(['$routeProvider', '$locationProvider', '$httpProvider',  function ($routeProvider, $locationProvider, $httpProvider) {

    var access = routingConfig.accessLevels;

    $routeProvider.when('/',
        {
            templateUrl:    'home',
            controller:     'HomeCtrl',
            access:         access.user
        });
    $routeProvider.when('/login',
        {
            templateUrl:    'login',
            controller:     'LoginCtrl',
            access:         access.anon
        });
    $routeProvider.when('/register',
        {
            templateUrl:    'register',
            controller:     'RegisterCtrl',
            access:         access.anon
        });
    $routeProvider.when('/private',
        {
            templateUrl:    'private',
            controller:     'PrivateCtrl',
            access:         access.user,
			resolve: {
			TasksRes:['Tasks', '$q', function(Tasks, $q){
				var delay = $q.defer();
				Tasks.getUserTasks(function(res){
					delay.resolve(res);
				});
				return  delay.promise ;				 
			}]			
			}
        });
    $routeProvider.when('/admin',
        {
            templateUrl:    'admin',
            controller:     'AdminCtrl',
            access:         access.admin,
			resolve: {			
				TasksRes:['Tasks', '$q', function(Tasks, $q){  
					var delay = $q.defer();
					Tasks.getAllForAdmin(function(res){
						delay.resolve(res);
					});
					return  delay.promise ;				 
				 }]
			}
        });
    $routeProvider.when('/404',
        {
            templateUrl:    '404',
            access:         access.public
        });
    $routeProvider.otherwise({redirectTo:'/404'});

    $locationProvider.html5Mode(true);

    var interceptor = ['$location', '$q', function($location, $q) {
        function success(response) {
            return response;
        }

        function error(response) {

            if(response.status === 401) {
			    console.log('response.status is 401!')
				
                $location.path('/login');
                return $q.reject(response);
            }
            else {
			    console.log('response.status is NOT 401!')
                return $q.reject(response);
            }
        }

        return function(promise) {
            return promise.then(success, error);
        }
    }];

    $httpProvider.responseInterceptors.push(interceptor);

}])
.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
	
    



	$rootScope.$on("$routeChangeStart", function (event, next, current) {
	    //console.log('route changed...'+next.access.title);	
		$rootScope.error = null;		
		
		if (!Auth.authorize(next.access)) {
			if(Auth.isLoggedIn()){
				$location.path('/');
			}
			else{    
				console.log('not logedin, redirected to login...');				
				$location.path('/login');
			}
		}
	});

}]);