'use strict';

angular.module('angular-client-side-auth')
.directive('accessLevel', ['Auth', function(Auth) {
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
                    if(!Auth.authorize(accessLevel, userRole))
                        element.css('display', 'none');
                    else
                        element.css('display', prevDisp);
                }
            }
        }
    };
}]);
//statusPicker directive
angular.module('angular-client-side-auth').directive('statusPicker', ['Tasks', function(Tasks) {
        function setClass(el, status) {
		    console.log('trying to set class to:'+status)
		    switch(status){
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
            scope.statuses	= ['new','active','completed'];	
			for(var i = 0 ; i < scope.statuses.length  ; i++){
				if(scope.statuses[i]==scope.task.status){
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
                setClass(element, scope.task.status);			
				element.on('click', function(){	
                    scope.$apply(shiftStatus);
					//lets save status
					Tasks.updateTask(scope.task,
					function(res){
                        setClass(element, scope.task.status);
		  
					},function(err) {
			  
					});														
				});
				
			}
		};

}]);

angular.module('angular-client-side-auth').directive('activeNav', ['$location', function($location) {
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