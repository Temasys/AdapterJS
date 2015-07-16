module.exports = function (config) {
  //'use strict';

  config.set({

    basePath: '',

    frameworks: ['mocha', 'chai'],

    files: ['../../publish/adapter.debug.js', 'globals.js'],

    reporters: ['mocha', 'xml'],

    port: 9876, // default port

    colors: true,

    autoWatch: false,

    singleRun: true,

    // Levels: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DISABLE,

    // set the timeout
    //browserDisconnectTimeout: 10000, // default 2000

    //browserDisconnectTolerance: 2, // default 0

    //browserNoActivityTimeout: 4 * 60 * 1000, //default 10000

    //captureTimeout: 4 * 60 * 1000, //default 60000

    customLaunchers: {},

    transports: ['websocket', 'flashsocket', 'xhr-polling', 'jsonp-polling', 'polling'],

    //reportSlowerThan: 1000,

    browsers: [],

    /*client: {
      useIframe: false,
      captureConsole: true
    },*/

    plugins: ['karma-mocha', 'karma-mocha-reporter', 'karma-chai', 'karma-xml-reporter']
  });
};