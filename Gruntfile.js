module.exports = function(grunt) {
    // Load tasks
    grunt.registerTask('test-watch', ['karma:watch']);
    grunt.registerTask('test-watch', ['karma:watch']); 
    grunt.registerTask('default', ['watch']);
	
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-karma');	  
	
    var karmaConfig = function(configFile, customOptions) {
		var options = { configFile: configFile, keepalive: true };
		//var travisOptions = process.env.TRAVIS && { browsers: ['Firefox'], //reporters: 'dots' };
		//return grunt.util._.extend(options, customOptions, travisOptions);
    };

    grunt.initConfig({
        /*
		karma: {
		  unit: { options: karmaConfig('test/config/unit.js') },
		  watch: { options: karmaConfig('test/config/unit.js', { singleRun:false, autoWatch: true}) }
		},
		*/
		karma: {
		    unit: {
			   configFile: 'test/config/unit.js',
		    },
		    watch: {
				configFile: 'test/config/unit.js', 
			    singleRun:false,
			    autoWatch: true
			}		  
		},		
		watch: {
		  all: {
			files: ['**/*.*'],		
			options: {
			  livereload: {
				port: 9000
			  }
			}
		  }
		}
    });
	

};