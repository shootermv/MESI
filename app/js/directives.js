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
  });
