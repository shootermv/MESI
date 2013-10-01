'use strict';

/* Directives */


angular.module('MesiApp.directives', []).
  directive('ngheader',function() {
    return  {
      restrict: 'E',      
      replace: true,
      transclude: true,     
      template: 
           '<div class="navbar navbar-inverse navbar-fixed-top">'+
		     ' <div class="navbar-inner">'+
		       ' <div class="container">'+
		          '<button type="button" class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">'+
		           ' <span class="icon-bar"></span>'+
		           ' <span class="icon-bar"></span>'+
		           ' <span class="icon-bar"></span>'+
		         ' </button>'+
		         ' <a class="brand" href="#">Project name</a>'+
		         ' <div class="nav-collapse collapse">'+
		           ' <ul class="nav">'+
		             ' <li class="active"><a href="#">Home</a></li>'+
		             ' <li><a href="#about">About</a></li>'+
		             ' <li><a href="#contact">Contact</a></li>'+
		           ' </ul>'+
		         ' </div>'+
		       ' </div>'+
		     ' </div>'+
		   ' </div>'

    };
  });
