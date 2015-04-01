var sharedConfig = require('./karma.conf.js');

module.exports = function(config) {

  sharedConfig(config);

  config.plugins.push('karma-opera-launcher');

  config.customLaunchers = {
    OperaUM: {
      base: 'Opera',
      flags: []
    }
  };

  // Run each browser manually for automated test
  config.browsers = ['OperaUM'];
};