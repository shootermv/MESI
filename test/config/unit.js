module.exports = function(config){
    config.set({
		frameworks:["jasmine"],
		// base path, that will be used to resolve files and exclude
		basePath : '../../',

		// list of files / patterns to load in the browser
		files : [

			'client/lib/angular/angular/angular.min.js',
			'client/lib/angular/**/*.js',  		
			'test/vendor/angular/angular-mocks.js',
			'client/js/app.js',
			'client/js/controllers.js',
			'client/js/directives.js',
			'client/js/filters.js',
			'client/js/routingConfig.js',
			'client/js/services.js',			
			'test/unit/*.spec.js'

		   
		],

		// use dots reporter, as travis terminal does not support escaping sequences
		// possible values: 'dots' || 'progress'
		reporters : 'progress',

		plugins: [
		'karma-phantomjs-launcher',
		'karma-jasmine'
		],
		// web server port
		port : 8089,

		// cli runner port
		runnerPort : 9109,


		// enable / disable colors in the output (reporters and logs)
		colors : true,

		// level of logging
		// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
		logLevel : config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch : true,

		// polling interval in ms (ignored on OS that support inotify)
		autoWatchInterval : 0,

		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera
		// - Safari
		// - PhantomJS
		browsers : ['PhantomJS'],

		// Continuous Integration mode
		// if true, it capture browsers, run tests and exit
		singleRun : false
})}