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
    singleRun: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // you can define custom flags
    customLaunchers: {
      ChromeUM: {
        base: 'Chrome',
        flags: ['--use-fake-ui-for-media-stream']
      },

      FirefoxUM: {
        base: 'Firefox',
        profile: 'default-1410323712842'
      },

      SafariUM: {
        base: 'Safari',
        flags: []
      },

      OperaUM: {
        base: 'Opera',
        flags: ['--use-fake-ui-for-media-stream']
      },

      IEUM: {
        base: 'IE',
        flags: []
      }
    },

    browsers: ['SafariUM'], //['ChromeUM', 'SafariUM', 'OperaUM', 'FirefoxUM', 'IEUM'],


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