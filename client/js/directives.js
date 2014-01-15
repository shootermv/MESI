'use strict';

angular.module('Mesi').directive('accessLevel', ['Auth', function(Auth) {
    return {
        restrict: 'A',
        link: function($scope, element, attrs) {
            var prevDisp = element.css('display')
                , userRole
                , accessLevel;

            $scope.user = Auth.user;
            $scope.$watch('user', function(user) {
                if(user.role)
                    userRole = user.role;
                updateCSS();
            }, true);

            attrs.$observe('accessLevel', function(al) {			    
                if(al) accessLevel = $scope.$eval(al);
                updateCSS();
            });

            function updateCSS() {
			 
                if(userRole && accessLevel) {
                    if(!Auth.authorize(accessLevel, userRole)){
                        element.css('display', 'none');
                    }else{
                        element.css('display', prevDisp);
						//if(userRole.title == 'user' && accessLevel==)
					}
                }
            }
        }
    };
}]);

angular.module('Mesi').directive('activeNav', ['$location', function($location) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var nestedA = element.find('a')[0];
            var path = nestedA.href;

            scope.location = $location;
            scope.$watch('location.absUrl()', function(newPath) {
                if (path === newPath) {
                    element.addClass('active');
                } else {
                    element.removeClass('active');
                }
            });
        }

    };

}]);

angular.module('Mesi').directive('cssnotification', [ '$timeout', '$rootScope',function($timeout, $rootScope) {

    return {
	    restrict:'A',
		link:function(scope, element, attrs) {
		    
		    $rootScope.$watch('success',function(newVal ,oldVal){
			    
				if(newVal){				   				   
					$timeout(function(){
						$rootScope.success = false;							
					},1000);
                }
		    },true)
		}  
	}
}]);
//statusPicker directive
angular.module('Mesi').directive('statusPicker', ['Tasks','$rootScope', function(Tasks, $rootScope) {
        function setClass(el, statusname) {
		    
		    switch(statusname){
				case 'new':
					el.attr('class','statuspckr btn-danger');
					break;					
				case 'active':
					el.attr('class','statuspckr btn-primary');
					break;					
				case 'completed':
					el.attr('class','statuspckr btn-success');
					break;					
			}			
		}
		function shiftStatus(scope){
            scope.statuses	= [{name:'new',id:2},{name:'active',id:1},{name:'completed',id:3}];	
			for(var i = 0 ; i < scope.statuses.length  ; i++){
				if(scope.statuses[i].name==scope.task.status.name){
					if((i+1) == scope.statuses.length)
						scope.task.status  = scope.statuses[0];
					else
					    scope.task.status  = scope.statuses[i+1];
					break;
				}
			}
		}
		return {
		    restrict: "E",
			link: function(scope, element, attrs, controller) {
                setClass(element, scope.task.status.name);			
				element.on('click', function(){	
				     
					 /*
                    scope.$apply(shiftStatus);									
					//lets save status
					Tasks.updateTask(scope.task,
					function(res){
                        setClass(element, scope.task.status.name);
						//dispaly notification
                        $rootScope.success='status updated successfully';

		                //must refresh al users task		                
						scope.getUserTasks();

					},function(err) {
			  
					});
					*/
					
					shiftStatus(scope);
					scope.updateTaskStatus(scope.task)
					
				});
				
			}
		};

}]);