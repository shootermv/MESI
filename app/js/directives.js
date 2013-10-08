'use strict';

/* Directives */


angular.module('MesiApp.directives', []).
  directive('ngheader',function() {
    return  {
      restrict: 'E',      
      replace: true,
      transclude: true,     
      templateUrl: 'partials/header.html'//link
    };
  }).

  directive('ngmodal',function() {
    return  {
      restrict: 'E',      
      replace: true,
     // transclude: true,     
      templateUrl: 'partials/modal.html',    
      /*controller: 'ProgrammerCtrl',*/
      link: function(scope, element, attrs, ProgrammerCtrl) {
          //scope.addTask =function(newtask){

          //  alert('o')
         // }
      }
    }
  });
