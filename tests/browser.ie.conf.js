var sharedConfig = require('./karma.conf.js');

module.exports = function(config) {

  sharedConfig(config);

  config.plugins.push('karma-ie-launcher');

  config.customLaunchers = {
    IEUM: {
      base: 'IE',
      flags: []
    }
  };

  // Run each browser manually for automated test
  config.browsers = ['IEUM'];
};