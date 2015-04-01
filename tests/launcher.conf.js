var sharedConfig = require('@@browser');

module.exports = function(config) {

  sharedConfig(config);

  config.files.push('@@unit');

  // generate random port
  config.port = @@port;
};