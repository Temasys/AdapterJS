module.exports = function (config) {
  'use strict';

  config.set({

    basePath: '',

    frameworks: ['mocha', 'chai'],

    files: [
      'source/*.js',
      'tests/*.spec.js'
    ],

    reporters: ['mocha'],

    port: 9876,
    colors: true,
    autoWatch: false,
    singleRun: false,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // you can define custom flags
    customLaunchers: {
      Chrome_gUM: {
        base: 'Chrome',
        flags: ['--use-fake-ui-for-media-stream']
      }
    },

    browsers: ['Chrome_gUM'], //, 'Safari', 'Opera', 'Firefox', 'IE'],


    plugins: [
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-chai',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-opera-launcher',
      'karma-safari-launcher',
      'karma-ie-launcher'
    ]

  });
};