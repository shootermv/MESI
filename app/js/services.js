'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('MesiApp.services', ['ngResource']).
factory('TasksOfProgrammer', function($resource){
       return $resource('tasks/:programmerId.json', {}, {
           query: {method:'GET', params:{taskId:'tasks'}}
       });

});


