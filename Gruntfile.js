module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-include-replace');
    grunt.loadNpmTasks('grunt-karma');

    grunt.initConfig({

      pkg: grunt.file.readJSON('package.json'),

      base: grunt.config('base') || grunt.option('base') || process.cwd(),

      source: 'source',

      googleAdapterPath: 'third_party/adapter/adapter.js',

      production: 'publish',

      bamboo: 'bamboo',

      pluginInfoRoot: grunt.option('pluginInfoRoot') || '<%= source %>',
      pluginInfoFile: grunt.option('pluginInfoFile') || 'pluginInfo.js',

      clean: {
        production: ['<%= production %>/'],
        bamboo: ['<%= bamboo %>/'],
        test: ['tests/gen/*', 'tests/results/*']
      },

      copy: {
        bamboo: {
          files: [{
            expand: true,
            cwd: '<%= production %>/',
            src: ['**'],
            dest: '<%= bamboo %>/adapterjs/<%= pkg.version %>'
          }, {
            expand: true,
            cwd: '<%= production %>/',
            src: ['**'],
            dest: '<%= bamboo %>/adapterjs/<%= pkg.version_major %>.' +
                '<%= pkg.version_minor %>.x'
          }, {
            expand: true,
            cwd: '<%= production %>/',
            src: ['**'],
            dest: '<%= bamboo %>/adapterjs/latest'
          }],
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
        production: {
            files: {
                '<%= production %>/adapter.min.js': ['<%= production %>/adapter.debug.js']
            }
        },
        screenshare: {
          files: {
            '<%= production %>/adapter.screenshare.min.js': ['<%= production %>/adapter.screenshare.js']
          },
        },
      },

  		concat: {
  			options: {
  				separator: '\n',
  				stripBanners: false,
  				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
  					'<%= grunt.template.today("yyyy-mm-dd") %> */\n\n'
  			},
  			production: {
  				src: ['<%= source %>/adapter.js'],
  				dest: '<%= production %>/adapter.debug.js'
  			},
  			screenshare: {
  				src: ['<%= source %>/adapter.js', '<%= source %>/adapter.screenshare.js'],
  				dest: '<%= production %>/adapter.screenshare.js'
  			}
  		},

      replace: {
        production: {
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

      includereplace: {
        withGoogle: {
          options: {
            // Task-specific options go here. 
            prefix: '@Goo@',
            includesDir: '.',
            processIncludeContents: function (includeContents, localVars, filePath) {
              if (filePath.indexOf(grunt.config.get('googleAdapterPath')) !== -1) {
                // Indent file and indent Google's exports
                return includeContents
                  // Comment export
                  .replace(/if \(typeof module \!\=\= 'undefined'\) \{(.|\n)*\}\n/gm, function(content) {
                  return '/* Orginal exports removed in favor of AdapterJS custom export.\n' + content + '*/\n';
                  })
                  // Indent (2 spaces so far, to be updated as AJS evolves)
                  .replace(/.*\n/g, function(line) { return '  ' + line; });
              } else { // not Google's AJS
                return includeContents;
              }
            },
          },
          // Files to perform replacements and includes with 
          src: [
            '<%= production %>/*.js',
            ],
          // Destination directory to copy files to 
          dest: './'
        },
        withPluginInfo: {
          options: {
            // Task-specific options go here. 
            prefix: '@Tem@',
            includesDir: '<%= pluginInfoRoot %>/',
          },
          // Files to perform replacements and includes with 
          src: [
            '<%= production %>/*.js',
            ],
          // Destination directory to copy files to 
          dest: './'
        },
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
              'tests/*.js',
              'tests/unit/*.js'
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
      },

      compress: {
        bamboo: {
          options: {
              mode: 'gzip'
          },
          expand: true,
          cwd: 'bamboo/adapterjs',
          src: ['**/*.js'],
          dest: 'bamboo/adapterjsgz/'
        }
      },

      yuidoc: {
        doc: {
          name: '<%= pkg.name %>',
          description: '<%= pkg.description %>',
          version: '<%= pkg.version %>',
          url: '<%= pkg.homepage %>',
          options: {
            paths: 'source/',
            outdir: 'doc/'
          }
        }
      },

      karma: {
        unit: {
          configFile: 'tests/karma.conf.js',
          browsers: [
            'ChromeCustom',
            // 'ChromeCanary',
            'Safari',
            'FirefoxCustom',
            // 'Opera',
            // 'PhantomJS',
            'IE'
          ]
        }
      }
    });

    grunt.registerTask('versionise', 'Adds version meta intormation', function() {
        var done = this.async(),
            arr = [];

        grunt.util.spawn({
            cmd: 'git',
            args: ['log', '-1', '--pretty=format:%h\n %ci']
        }, function(err, result) {
            if (err) {
                return done(false);
            }
            arr = result.toString().split('\n ');
            grunt.config('meta.rev', arr[0]);
            grunt.config('meta.date', arr[1]);
        });

        try {
            var version = grunt.config('pkg.version').
            match('^([0-9]+)\.([0-9]+)\.([0-9]+)$');
            grunt.config('pkg.version_major', version[1]);
            grunt.config('pkg.version_minor', version[2]);
            grunt.config('pkg.version_release', version[3]);
        } catch (e) {
            grunt.fatal('Version ' + grunt.config('pkg.version') + ' has not the correct format.');
        }

        grunt.util.spawn({
            cmd: 'git',
            args: [
                'for-each-ref',
                '--sort=*authordate',
                '--format="%(tag)"',
                'refs/tags'
            ]
        }, function(err, result) {
            if (err) {
                return done(false);
            }
            arr = result.toString().split('\n');

            var tag = arr[arr.length - 1];
            tag = tag.toString();
            grunt.config('meta.tag', tag);

            grunt.log.write('Version: ' + grunt.config('pkg.version') +
                '\nRevision: ' + grunt.config('meta.rev') +
                '\nDate: ' + grunt.config('meta.date') +
                '\nGit Tag: ' + grunt.config('meta.tag') + '\n');

            done(result);
        });
    });

    grunt.registerTask('bamboovars', 'Write bamboo variables to file', function() {
        grunt.file.write('bamboo/vars', 'version=' + grunt.config('pkg.version') + '\n' +
            'version_major=' + grunt.config('pkg.version_major') + '\n' +
            'version_minor=' + grunt.config('pkg.version_minor') + '\n' +
            'version_release=' + grunt.config('pkg.version_release'));
        grunt.log.writeln('bamboo/vars file successfully created');
    });

    grunt.registerTask('CheckSubmodules', 'Checks that third_party/adapter is properly checked out', function() {
      if(!grunt.file.exists(grunt.config.get('googleAdapterPath'))) {
        grunt.fail.fatal('Couldn\'t find ' + grunt.config.get('googleAdapterPath') + '\n' +
                      'Output would be incomplete. Did you remember to initialize submodules?\nPlease run: git submodule update --init');
      }
    });

    grunt.registerTask('CheckPluginInfo', 'Checks for existing config file', function() {
      var fullPath = grunt.config.get('pluginInfoRoot') + '/' + grunt.config.get('pluginInfoFile');
      grunt.verbose.writeln('Checking that the plugin info file exists.');
      grunt.verbose.writeln('Privided Path : ' + fullPath);
      if (grunt.file.exists(fullPath)) {
        grunt.log.oklns('Plugin info file found.');
      } else {
        grunt.fail.fatal('Plugin info file does not exist : ' + fullPath);
      }
    });

    // NOTE(J-O) Prep for webrtc-adapter 0.2.10, will need to be compiled
    grunt.registerTask('webrtc-adapter', 'Build the webrtc-adapter submodule', function() {
      grunt.verbose.writeln('Spawning child process to compile webrtc-adapter subgrunt.');
      var done = this.async();
      var child = grunt.util.spawn({
        grunt: true,
        args: ['--gruntfile', './third_party/adapter/Gruntfile.js', 'build'],
        opts: {stdio: 'inherit'},
      }, function(error, result) {});
      child.on('close', function (code) {
        done(code === 0);
      });
    });

    grunt.registerTask('publish', [
        'CheckSubmodules',
        'CheckPluginInfo',
        // 'webrtc-adapter',
        'versionise',
        'clean:production',
        'concat',
        'replace',
        'includereplace',
        'uglify',
        'yuidoc'
    ]);

    grunt.registerTask('bamboo', [
        'publish',
        'clean:bamboo',
        'copy',
        'compress',
        'bamboovars'
    ]);

    grunt.registerTask('test', [
      'publish',
      'karma'
    ]);
};
