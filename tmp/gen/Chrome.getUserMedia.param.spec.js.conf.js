/*! adapterjs - v0.11.0 - 2015-07-21 */

var sharedConfig = require(['base/browser.Chrome.conf.js'], function() {

module.exports = function(config) {

  sharedConfig(config);

  config.files.push('../unit/getUserMedia.param.spec.js');

  // generate random port
  config.port = 5004;

  config.xmlReporter = {
	   outputFile: '../results/Chrome/getUserMedia.param.spec.js.xml'
  };
};

});