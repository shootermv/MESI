module.exports = function(grunt) {
    // Load tasks
    grunt.loadNpmTasks('grunt-recess');
    grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	
    grunt.initConfig({
	    distdir: 'dist',
		pkg: grunt.file.readJSON('package.json'),
		src: {
			less:['less/*.less'],
            js: ['js/**/*.js']		
		},
		copy: {
		  assets: {
			files: [{ dest: '<%= distdir %>/css/images/', src : '**', expand: true, cwd: 'css/images/' }]
		  }
		},		
		uglify: {
		  dist:{
			src:['<%= src.js %>'],
			dest:'<%= distdir %>/js/<%= pkg.name %>.min.js'
		  }
		},		
		recess: {
		  build: {
			files: {
			  '<%= distdir %>/css/<%= pkg.name %>.css':
			  ['<%= src.less %>'] 
			},
			options: {
			  compile: true
			}
		  },
		  min: {
			files: {
			  '<%= distdir %>/css/<%= pkg.name %>.min.css': ['<%= src.less %>']
			},
			options: {
			  compress: true
			}
		  }
		}
    });
	
    grunt.registerTask('default',['recess:min','uglify','copy'])
};