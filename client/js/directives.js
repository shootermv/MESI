'use strict';
//accessLevel
angular.module('Mesi').directive('accessLevel', ['Auth', function (Auth) {
    return {
        restrict: 'A',
        link: function ($scope, element, attrs) {
            var prevDisp = element.css('display')
                , userRole
                , accessLevel;

            $scope.user = Auth.user;
            $scope.$watch('user', function (user) {

                if (user.role)
                    userRole = user.role;
                updateCSS();
            }, true);
            //gets access level from the attr
            attrs.$observe('accessLevel', function (al) {
                if (al) accessLevel = $scope.$eval(al);
                updateCSS();
            });

            function updateCSS() {

                if (userRole && accessLevel) {
                    if (!Auth.authorize(accessLevel, userRole)) {
                        element.css('display', 'none');
                    } else {

                        element.css('display', prevDisp);
                        //if(userRole.title == 'user' && accessLevel==)
                    }
                }
            }
        }
    };
}]);
//activenav
angular.module('Mesi').directive('activeNav', ['$location', function ($location) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var nestedA = element.find('a')[0];
            var path = nestedA.href;

            scope.location = $location;
            scope.$watch('location.absUrl()', function (newPath) {
                if (path === newPath) {
                    element.addClass('active');
                } else {
                    element.removeClass('active');
                }
            });
        }

    };

}]);
//cssnotification
angular.module('Mesi').directive('cssnotification', ['$timeout', '$rootScope', function ($timeout, $rootScope) {

    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            $rootScope.$watch('success', function (newVal, oldVal) {
                if (newVal) {
                    $timeout(function () {
                        $rootScope.success = false;
                    }, 1000);
                }
            }, true)
        }
    }
}]);
//statusPicker directive
angular.module('Mesi').directive('statusPicker', ['Tasks', '$rootScope', function (Tasks, $rootScope) {
    function setClass(el, statusname) {

        switch (statusname) {
            case 'new':
                el.attr('class', 'statuspckr btn-danger');
                break;
            case 'active':
                el.attr('class', 'statuspckr btn-primary');
                break;
            case 'completed':
                el.attr('class', 'statuspckr btn-success');
                break;
        }
    }
    function shiftStatus(scope) {
        scope.statuses = [{ name: 'new', id: 2 }, { name: 'active', id: 1 }, { name: 'completed', id: 3 }];
        for (var i = 0; i < scope.statuses.length; i++) {
            if (scope.statuses[i].name == scope.task.status.name) {
                if ((i + 1) == scope.statuses.length)
                    scope.task.status = scope.statuses[0];
                else
                    scope.task.status = scope.statuses[i + 1];
                break;
            }
        }
    }
    return {
        restrict: "E",
        link: function (scope, element, attrs, controller) {
            setClass(element, scope.task.status.name);
            element.on('click', function () {
                shiftStatus(scope);
                scope.updateTaskStatus(scope.task)

            });

        }
    };

}]);

angular.module('Mesi').directive('loader', ['$rootScope', function ($rootScope) {
    return {
        restrict: "E",
        templateUrl: 'loader',
        link: function (scope, element, attrs) {
            element.addClass('hide');

            $rootScope.$on('$routeChangeStart', function () {
                element.removeClass('hide');
            });
            $rootScope.$on('$routeChangeSuccess', function () {
                element.addClass('hide');
            });
        }
    }
}]);
angular.module('Mesi').directive('dropdownToggle', ['$document', '$location', function ($document, $location) {
    var openElement = null,
        closeMenu = angular.noop;
    return {
        restrict: 'CA',
        link: function (scope, element, attrs) {
            scope.$watch('$location.path', function () { closeMenu(); });
            element.parent().bind('click', function () { closeMenu(); });
            element.bind('click', function (event) {

                var elementWasOpen = (element === openElement);

                event.preventDefault();
                event.stopPropagation();

                if (!!openElement) {
                    closeMenu();
                }

                if (!elementWasOpen && !element.hasClass('disabled') && !element.prop('disabled')) {
                    element.parent().addClass('open');
                    openElement = element;
                    closeMenu = function (event) {
                        if (event) {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                        $document.unbind('click', closeMenu);
                        element.parent().removeClass('open');
                        closeMenu = angular.noop;
                        openElement = null;
                    };
                    $document.bind('click', closeMenu);
                }
            });
        }
    };
}]);