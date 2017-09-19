module.exports = function (grunt) {
	// Load tasks
	grunt.loadNpmTasks('grunt-recess');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.initConfig({
		distdir: 'dist',
		pkg: grunt.file.readJSON('package.json'),
		src: {
			less: ['less/*.less'],
			js: ['js/**/*.js']
		},
		copy: {
			assets: {
				files: [{
					dest: '<%= distdir %>/css/images/',
					src: '**', expand: true, cwd: 'css/images/'
				}, {
					dest: '<%= distdir %>/fonts/',
					src: '**', expand: true, cwd: 'fonts/'
				}, {
					expand: true,
					cwd: 'node_modules/',
					dest: '<%= distdir %>/vendors/angular/',
					src: 'angular*/*.min.js',
				}, {
					expand: true,
					cwd: 'node_modules/',
					dest: '<%= distdir %>/vendors/',
					src: 'underscore/*min.js',
				}, {
					expand: true,
					cwd: 'node_modules/angular-mocks',
					dest: '<%= distdir %>/vendors/angular/angular-mocks',
					src: 'angular-mocks.js',
				}]
			}
		},
		uglify: {
			dist: {
				src: ['<%= src.js %>'],
				options: {
					sourceMap: true,
					sourceMapName: '<%= distdir %>/js/<%= pkg.name %>.js.map'
				},
				dest: '<%= distdir %>/js/<%= pkg.name %>.min.js'
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

	grunt.registerTask('default', ['recess:min', 'uglify', 'copy'])
};