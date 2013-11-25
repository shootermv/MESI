module.exports = function(grunt) {



    grunt.initConfig({

        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['server/tests/**/*.js']
            }
        },
		watch: {
		  css: {
			files: ['**/*.*'],		
			options: {
			  livereload: {
				port: 9000
			  }
			}
		  }
		}
    });
    // Load tasks
    grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-contrib-watch');
	 
    grunt.registerTask('serverTests', 'mochaTest');
    grunt.registerTask('test', 'serverTests');   
    grunt.registerTask('default', ['watch']);	

};