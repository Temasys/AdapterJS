module.exports = function (grunt) {

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-replace');

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		base: grunt.config('base') || grunt.option('base') || process.cwd(),

		source: 'source',

		production: 'publish',

		clean: {
			production: ['<%= production %>/']
		},

		concat: {
			options: {
				separator: '\n',
				stripBanners: false,
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
					'<%= grunt.template.today("yyyy-mm-dd") %> */\n\n'
			},
			production: {
				src: ['<%= source %>/*.js'],
				dest: '<%= production %>/adapter.debug.js'
			}
		},

		uglify: {
			options: {
				mangle: false,
				drop_console: true,
				compress: {
					drop_console: true
				},
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
					'<%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			production_min: {
				files: {
					'<%= production %>/adapter.min.js': ['<%= production %>/adapter.debug.js']
				}
			}
		},

		replace: {
			dist: {
				options: {
					variables: {
						'version': '<%= pkg.version %>'
					},
					prefix: '@@'
				},
				files: [{
					expand: true,
					flatten: true,
					src: [
						'<%= production %>/*.js'
					],
					dest: '<%= production %>/'
				}]
			}
		},

		jshint: {
			build: {
				options: grunt.util._.merge({
					node: true
				}, grunt.file.readJSON('.jshintrc')),
				src: [
					'package.json',
					'Gruntfile.js'
				]
			},
			tests: {
				options: grunt.util._.merge({
					node: true
				}, grunt.file.readJSON('.jshintrc')),
				src: [
					'tests/*_test.js'
				]
			},
			app: {
				options: grunt.util._.merge({
					browser: true,
					devel: true,
					globals: {
						require: true,
						define: true
					}
				}, grunt.file.readJSON('.jshintrc')),
				src: [
					'<%= source %>/*.js'
				]
			}
		}
	});

	grunt.registerTask('publish', [
		'clean:production',
		'concat:production',
		'replace:dist',
		'uglify:production_min'
	]);
};