module.exports = function (config) {
  'use strict';

  config.set({

    basePath: '',

    frameworks: ['mocha', 'chai'],

    files: ['../../publish/adapter.debug.js'],

    reporters: ['mocha'],

    port: 9876, // default port

    colors: true,

    autoWatch: false,

    singleRun: true,

    // Levels: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // set the timeout
    //browserDisconnectTimeout: 10000, // default 2000

    //browserDisconnectTolerance: 1, // default 0

    //browserNoActivityTimeout: 4 * 60 * 1000, //default 10000

    //captureTimeout: 4 * 60 * 1000, //default 60000

    customLaunchers: {},

    browsers: [],

    plugins: ['karma-mocha', 'karma-mocha-reporter', 'karma-chai']
  });
};