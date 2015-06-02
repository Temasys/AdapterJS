/*! adapterjs - v0.10.5 - 2015-04-08 */

var sharedConfig = require('../browser.safari.conf.js');

module.exports = function(config) {

  sharedConfig(config);

  config.files.push('../unit/MediaStream.prop.spec.js');

  // generate random port
  config.port = 5034;
};