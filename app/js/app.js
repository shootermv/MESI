'use strict';


// Declare app level module which depends on filters, and services
angular.module('MesiApp', ['MesiApp.filters', 'MesiApp.services', 'MesiApp.directives', 'MesiApp.controllers']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/programmer/:programmerId', {
    	templateUrl: 'partials/TasksOfProgrammer.html',
    	controller: 'ProgrammerCtrl'
    });
    $routeProvider.when('/AssignTasks', {templateUrl: 'partials/AssignTasks.html', controller: 'TaskCtrl'});
    $routeProvider.otherwise({redirectTo: '/programmer/1'});
  }]);

 



