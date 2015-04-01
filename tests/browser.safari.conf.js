var sharedConfig = require('./karma.conf.js');

module.exports = function(config) {

  sharedConfig(config);

  config.plugins.push('karma-safari-launcher');

  config.customLaunchers = {
    SafariUM: {
      base: 'Safari',
      flags: []
    }
  };

  // Run each browser manually for automated test
  config.browsers = ['SafariUM'];
};