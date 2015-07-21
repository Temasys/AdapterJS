var sharedConfig = require(['base/@@browser'], function() {

module.exports = function(config) {

  sharedConfig(config);

  config.files.push('@@unit');

  // generate random port
  config.port = @@port;

  config.xmlReporter = {
	   outputFile: '@@testResult'
  };
};

});