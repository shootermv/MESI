module.exports = function(grunt) {
    // Load tasks
    grunt.registerTask('test-watch', ['karma:watch']);
    
    
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-karma');	  
	
	grunt.registerTask('default', ['watch']);
	
	
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
			files: ['**/*.html','**/*.js','**/*.less','**/*.jade'],		
			options: {
			  livereload: {
				port: 9000
			  }
			},
            tasks: "less"
		  }
		},
		less: {
		  development: {
			options: {
			  paths: ["assets/css"]
			},
			files: {
			  "client/css/app.css": "client/css/app.less"
			}
		  }
		}		
		 
    });
	

};