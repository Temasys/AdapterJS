// Karma configuration
// Generated on Tue Jul 21 2015 13:17:34 GMT+0800 (SGT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'requirejs', 'chai'],

    // list of files / patterns to load in the browser
    files: [
      // config files
      {pattern: 'karma.conf.js',                  included: true},
      {pattern: 'test-main.js',                   included: true},
      {pattern: '../publish/adapter.debug.js',    included: true},
      {pattern: 'globals.js',                     included: true},

      // tests
      {pattern: 'unit/*.spec.js',                 included: false},
    ],


    // list of files to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'cdash'],

    cdashReporter: {
      outputFolder: 'results',
      // outputFileName: 'cdash-result.xml',
      siteConfig: './gen/cdash-site-config.json'
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DISABLE,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    // Note: set from Grunt
    // browsers: ['Chrome'],

    customLaunchers: {
        ChromeCustom: {
          base: 'Chrome',
          flags: ['--use-fake-ui-for-media-stream']
        },
        FirefoxCustom: {
          base: 'Firefox',
          prefs: {
            'media.navigator.permission.disabled': true,
            'media.getusermedia.screensharing.enabled': true
          } 
        }
    },

    transports: ['websocket', 'flashsocket', 'xhr-polling', 'jsonp-polling', 'polling'],

    browserNoActivityTimeout: 4 * 60 * 1000, //default 10000

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    plugins: ['karma-mocha', 
              'karma-mocha-reporter', 
              'karma-chai', 
              'karma-cdash-reporter',
              'karma-chrome-launcher', 
              'karma-safari-launcher', 
              'karma-firefox-launcher',
              'karma-ie-launcher',
              'karma-opera-launcher',
              'karma-requirejs']
  })
}
