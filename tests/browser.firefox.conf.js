var sharedConfig = require('./karma.conf.js');

module.exports = function(config) {

  sharedConfig(config);

  config.plugins.push('karma-firefox-launcher');

  // For automated tests on Firefox, go to about:config, set the media.navigator.permission.disabled to true
  // Modify karma-firefox-launcher in index.js line where self._execCommand is and set as self._execCommand(command, [url]);
  // This should run the Firefox browser. Do not have any open Firefox browsers meanwhile.
  config.customLaunchers = {
    FirefoxUM: {
      base: 'Firefox',
      profile: 'default-1410323712842'
    }
  };

  // Run each browser manually for automated test
  config.browsers = ['FirefoxUM'];
};