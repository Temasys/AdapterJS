module.exports = function (config) {
  'use strict';

  config.set({

    basePath: '',

    frameworks: ['mocha', 'chai'],

    files: [
      'publish/adapter.debug.js',
      'tests/MediaStream.event.spec.js',
      'tests/MediaStream.prop.spec.js',
      'tests/MediaStreamTrack.event.spec.js',
      'tests/MediaStreamTrack.prop.spec.js'
    ],

    reporters: ['mocha'],

    port: 9876,
    colors: true,
    autoWatch: false,
    singleRun: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // set the timeout
    //browserNoActivityTimeout: 100000,

    browserDisconnectTimeout: 10000, // default 2000

    browserDisconnectTolerance: 1, // default 0

    browserNoActivityTimeout: 4 * 60 * 1000, //default 10000

    captureTimeout: 4 * 60 * 1000, //default 60000

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
        flags: []
      },

      IEUM: {
        base: 'IE',
        flags: []
      }
    },

    // For automated tests on Firefox, go to about:config, set the media.navigator.permission.disabled to true
    // Modify karma-firefox-launcher in index.js line where self._execCommand is and set as self._execCommand(command, [url]);
    // This should run the Firefox browser. Do not have any open Firefox browsers meanwhile.

    // Run each browser manually for automated test
    browsers: ['FirefoxUM'], //'FirefoxUM', 'OperaUM', 'SafariUM', 'IEUM'],


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