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
      {pattern: 'karma.conf.js', included: true},
      {pattern: 'test-main.js', included: true},

      //   '../node_modules/requirejs/require.js',
      // '../node_modules/karma-requirejs/lib/adapter.js',


      {pattern: '../source/adapter.js', included: true},
      {pattern: 'globals.js', included: true},
      // {pattern: 'browser.*.conf.js', included: true},
      // {pattern: 'gen/*.js', included: false},
      {pattern: 'unit/MediaStream.event.spec.js', included: true},
      // {pattern: 'unit/*.js', included: true},
      // 'test-main.js',
      // 'gen/*.js',
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
    reporters: ['mocha'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_ERROR,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    // browsers: ['Chrome'],

    customLaunchers: {
        ChromeUM: {
          base: 'Chrome',
          flags: ['--use-fake-ui-for-media-stream']
        }
    },

    transports: ['websocket', 'flashsocket', 'xhr-polling', 'jsonp-polling', 'polling'],

    browserNoActivityTimeout: 4 * 60 * 1000, //default 10000

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    plugins: ['karma-mocha', 'karma-mocha-reporter', 'karma-chai', 'karma-xml-reporter', 'karma-chrome-launcher', 'karma-safari-launcher', 'karma-requirejs']
  })
}
