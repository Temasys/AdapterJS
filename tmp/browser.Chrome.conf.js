var sharedConfig = require(['karma.conf.js'], function() {

  module.exports = function(config) {

    sharedConfig(config);

    config.plugins.push('karma-chrome-launcher');

    // you can define custom flags
    config.customLaunchers = {
      ChromeUM: {
        base: 'Chrome',
        flags: ['--use-fake-ui-for-media-stream']
      }
    };

    // Run each browser manually for automated test
    config.browsers = ['ChromeUM'];
  };
});