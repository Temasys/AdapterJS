/*! adapterjs - v0.11.0 - 2015-07-21 */

var sharedConfig = require(['base/browser.Chrome.conf.js'], function() {

module.exports = function(config) {

  sharedConfig(config);

  config.files.push('../unit/RTCPeerConnection.offerconstraints.spec.js');

  // generate random port
  config.port = 5001;

  config.xmlReporter = {
	   outputFile: '../results/Chrome/RTCPeerConnection.offerconstraints.spec.js.xml'
  };
};

});