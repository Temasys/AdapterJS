// Define extension popup bar text
AdapterJS.TEXT.EXTENSION = {
  REQUIRE_INSTALLATION_FF: 'To enable screensharing you need to install the Skylink WebRTC tools Firefox Add-on.',
  REQUIRE_INSTALLATION_CHROME: 'To enable screensharing you need to install the Skylink WebRTC tools Chrome Extension.',
  REQUIRE_REFRESH: 'Please refresh this page after the Skylink WebRTC tools extension has been installed.',
  BUTTON_FF: 'Install Now',
  BUTTON_CHROME: 'Go to Chrome Web Store'
};

// Define extension settings
AdapterJS.extensionInfo = {
  chrome: {
    extensionId: 'ljckddiekopnnjoeaiofddfhgnbdoafc',
    extensionLink: 'https://chrome.google.com/webstore/detail/skylink-webrtc-tools/ljckddiekopnnjoeaiofddfhgnbdoafc',
    // Define this to use iframe method
    iframeLink: 'https://cdn.temasys.com.sg/skylink/extensions/detectRTC.html',
    // Invoke this again if AdapterJS.extensionInfo is defined later with a different iframeLink
    iframeReloadFn: null
  },
  // Required only for Firefox 51 and below
  firefox: {
    extensionLink: 'https://addons.mozilla.org/en-US/firefox/addon/skylink-webrtc-tools/'
  }
};

AdapterJS.defineMediaSourcePolyfill = function () {
  var baseGetUserMedia = null;

  var clone = function(obj) {
    if (null === obj || 'object' !== typeof obj) {
      return obj;
    }
    var copy = obj.constructor();
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        copy[attr] = obj[attr];
      }
    }
    return copy;
  };

  if (window.navigator.mozGetUserMedia) {
    baseGetUserMedia = window.navigator.getUserMedia;

    navigator.getUserMedia = function (constraints, successCb, failureCb) {

      if (constraints && constraints.video && !!constraints.video.mediaSource) {
        // intercepting screensharing requests

        // Invalid mediaSource for firefox, only "screen" and "window" are supported
        if (constraints.video.mediaSource !== 'screen' && constraints.video.mediaSource !== 'window') {
          failureCb(new Error('GetUserMedia: Only "screen" and "window" are supported as mediaSource constraints'));
          return;
        }

        var updatedConstraints = clone(constraints);

        updatedConstraints.video.mozMediaSource = updatedConstraints.video.mediaSource =
          Array.isArray(updatedConstraints.video.mediaSource) ?
          updatedConstraints.video.mediaSource[0] : updatedConstraints.video.mediaSource;

        // so generally, it requires for document.readyState to be completed before the getUserMedia could be invoked.
        // strange but this works anyway
        var checkIfReady = setInterval(function () {
          if (document.readyState === 'complete') {
            clearInterval(checkIfReady);

            baseGetUserMedia(updatedConstraints, successCb, function (error) {
              if (['NotAllowedError', 'PermissionDeniedError', 'SecurityError', 'NotAllowedError'].indexOf(error.name) > -1 &&
                window.parent.location.protocol === 'https:' && window.webrtcDetectedVersion < 52) {
                AdapterJS.renderNotificationBar(AdapterJS.TEXT.EXTENSION.REQUIRE_INSTALLATION_FF,
                  AdapterJS.TEXT.EXTENSION.BUTTON_FF, function (e) {
                  window.open(AdapterJS.extensionInfo.firefox.extensionLink, '_blank');
                  if (e.target && e.target.parentElement && e.target.nextElementSibling &&
                    e.target.nextElementSibling.click) {
                    e.target.nextElementSibling.click();
                  }
                  // Trigger refresh bar
                  AdapterJS.renderNotificationBar(AdapterJS.TEXT.EXTENSION ?
                    AdapterJS.TEXT.EXTENSION.REQUIRE_REFRESH : AdapterJS.TEXT.REFRESH.REQUIRE_REFRESH,
                    AdapterJS.TEXT.REFRESH.BUTTON, function () {
                    window.open('javascript:location.reload()', '_top');
                  }); // jshint ignore:line
                });
              } else {
                failureCb(error);
              }
            });
          }
        }, 1);

      } else { // regular GetUserMediaRequest
        baseGetUserMedia(constraints, successCb, failureCb);
      }
    };

    AdapterJS.getUserMedia = window.getUserMedia = navigator.getUserMedia;
    /* Comment out to prevent recursive errors
    navigator.mediaDevices.getUserMedia = function(constraints) {
      return new Promise(function(resolve, reject) {
        window.getUserMedia(constraints, resolve, reject);
      });
    };*/

  } else if (window.navigator.webkitGetUserMedia && window.webrtcDetectedBrowser !== 'safari') {
    baseGetUserMedia = window.navigator.getUserMedia;
    var iframe = document.createElement('iframe');

    navigator.getUserMedia = function (constraints, successCb, failureCb) {
      if (constraints && constraints.video && !!constraints.video.mediaSource) {
        if (window.webrtcDetectedBrowser !== 'chrome') {
          // This is Opera/, which does not support screensharing
          failureCb(new Error('Current browser does not support screensharing'));
          return;
        }

        var updatedConstraints = clone(constraints);
        updatedConstraints.video.mediaSource = typeof updatedConstraints.video.mediaSource === 'string' ?
          [updatedConstraints.video.mediaSource] : updatedConstraints.video.mediaSource;

        function fetchStream (response) {
          // Success retrieve stream
          if (response.success) {
            updatedConstraints.video.mandatory = updatedConstraints.video.mandatory || {};
            updatedConstraints.video.mandatory.chromeMediaSource = 'desktop';
            updatedConstraints.video.mandatory.maxWidth = window.screen.width > 1920 ? window.screen.width : 1920;
            updatedConstraints.video.mandatory.maxHeight = window.screen.height > 1080 ? window.screen.height : 1080;
            updatedConstraints.video.mandatory.chromeMediaSourceId = response.sourceId;
            console.info(updatedConstraints);
            delete updatedConstraints.video.mediaSource;
            baseGetUserMedia(updatedConstraints, successCb, failureCb);
          // Error, return error
          } else {
            // Extension not installed, trigger to install
            if (response.extensionLink) {
              AdapterJS.renderNotificationBar(AdapterJS.TEXT.EXTENSION.REQUIRE_INSTALLATION_CHROME,
                AdapterJS.TEXT.EXTENSION.BUTTON_CHROME, function (e) {
                window.open(response.extensionLink, '_blank');
                if (e.target && e.target.parentElement && e.target.nextElementSibling &&
                  e.target.nextElementSibling.click) {
                  e.target.nextElementSibling.click();
                }
                // Trigger refresh bar
                AdapterJS.renderNotificationBar(AdapterJS.TEXT.EXTENSION ?
                  AdapterJS.TEXT.EXTENSION.REQUIRE_REFRESH : AdapterJS.TEXT.REFRESH.REQUIRE_REFRESH,
                  AdapterJS.TEXT.REFRESH.BUTTON, function () {
                  window.open('javascript:location.reload()', '_top');
                }); // jshint ignore:line
              });
            }
            failureCb(response.error);
          }
        }

        // Use iframe method
        if (AdapterJS.extensionInfo.chrome.iframeLink) {
          iframe.getSourceId(updatedConstraints.video.mediaSource, fetchStream);
        // Use new method
        } else {
          var icon = document.createElement('img');
          icon.src = 'chrome-extension://' + AdapterJS.extensionInfo.chrome.extensionId + '/icon.png';

          icon.onload = function() {
            // Check if extension is enabled, it should return data
            chrome.runtime.sendMessage(AdapterJS.extensionInfo.chrome.extensionId, {
              type: 'get-version'
            }, function (versionRes) {
              // Extension not enabled
              if (!(versionRes && typeof versionRes === 'object' && versionRes.type === 'send-version')) {
                fetchStream({
                  success: false,
                  error: new Error('Extension is disabled')
                });
                return;
              }

              console.info(updatedConstraints);

              chrome.runtime.sendMessage(AdapterJS.extensionInfo.chrome.extensionId, {
                type: 'get-source',
                sources: updatedConstraints.video.mediaSource
              }, function (sourceRes) {
                // Permission denied
                if (!(sourceRes && typeof sourceRes === 'object')) {
                  fetchStream({
                    success: false,
                    error: new Error('Retrieval failed')
                  });
                // Could be cancelled
                } else if (sourceRes.type === 'send-source-error') {
                  fetchStream({
                    success: false,
                    error: new Error('Permission denied for screen retrieval')
                  });
                } else {
                  fetchStream({
                    success: true,
                    sourceId: sourceRes.sourceId
                  });
                }
              });
            });
          };

          icon.onerror = function () {
            fetchStream({
              success: false,
              error: new Error('Extension not installed'),
              extensionLink: AdapterJS.extensionInfo.chrome.extensionLink
            });
          };
        }
      } else {
        baseGetUserMedia(constraints, successCb, failureCb);
      }
    };

    AdapterJS.getUserMedia = window.getUserMedia = navigator.getUserMedia;
    navigator.mediaDevices.getUserMedia = function(constraints) {
      return new Promise(function(resolve, reject) {
        window.getUserMedia(constraints, resolve, reject);
      });
    };

    // Load for iframe method
    AdapterJS.extensionInfo.chrome.iframeReloadFn = function () {
      if (!AdapterJS.extensionInfo.chrome.iframeLink) {
        return;
      }

      var states = {
        loaded: false,
        error: false
      };

      // Remove previous iframe if it exists
      if (iframe) {
        // Prevent errors thrown when iframe does not exists yet
        try {
          (document.body || document.documentElement).removeChild(iframe);
        } catch (e) {}
      }

      iframe.onload = function() {
        states.loaded = true;
      };

      iframe.onerror = function () {
        states.error = true;
      };

      iframe.src = AdapterJS.extensionInfo.chrome.iframeLink;
      iframe.style.display = 'none';

      iframe.getSourceId = function (sources, cb) {
        // If iframe failed to load, ignore
        if (states.error) {
          cb({
            success: false,
            error: new Error('iframe is not loaded')
          });
          return;
        }

        // Listen to iframe messages
        function getSourceId () {
          window.addEventListener('message', function iframeListener (evt) {
            // Unload since it should be replied once if success or failure
            window.removeEventListener('message', iframeListener);
            // If no data is returned, it is incorrect
            if (!evt.data) {
              cb({
                success: false,
                error: new Error('Failed retrieving response')
              });
            // Extension not installed
            } else if (evt.data.chromeExtensionStatus === 'not-installed') {
              cb({
                success: false,
                error: new Error('Extension is not installed'),
                // Should return the above configured chrome.extensionLink but fallback for users using custom detectRTC.html
                extensionLink: evt.data.data || AdapterJS.extensionInfo.chrome.extensionLink
              });
            // Extension not enabled
            } else if (evt.data.chromeExtensionStatus === 'installed-disabled') {
              cb({
                success: false,
                error: new Error('Extension is disabled')
              });
            // Permission denied for retrieval
            } else if (evt.data.chromeMediaSourceId === 'PermissionDeniedError') {
              cb({
                success: false,
                error: new Error('Permission denied for screen retrieval')
              });
            // Source ID retrieved
            } else if (evt.data.chromeMediaSourceId && typeof evt.data.chromeMediaSourceId === 'string') {
              cb({
                success: true,
                sourceId: evt.data.chromeMediaSourceId
              });
            // Unknown error which is invalid state whereby iframe is not returning correctly and source cannot be retrieved correctly
            } else {
              cb({
                success: false,
                error: new Error('Failed retrieving selected screen')
              });
            }
          });

          // Check if extension has loaded, and then fetch for the sourceId
          iframe.contentWindow.postMessage({
            captureSourceId: true,
            sources: sources,
            extensionId: AdapterJS.extensionInfo.chrome.extensionId,
            extensionLink: AdapterJS.extensionInfo.chrome.extensionLink
          }, '*');
        }

        // Set interval to wait for iframe to load till 5 seconds before counting as dead
        if (!states.loaded) {
          var endBlocks = 0;
          var intervalChecker = setInterval(function () {
            if (!states.loaded) {
              // Loading of iframe has been dead.
              if (endBlocks === 50) {
                clearInterval(intervalChecker);
                cb({
                  success: false,
                  error: new Error('iframe failed to load')
                });
              } else {
                endBlocks++;
              }
            } else {
              clearInterval(intervalChecker);
              getSourceId();
            }
          }, 100);
        } else {
          getSourceId();
        }
      };

      // Re-append to reload
      (document.body || document.documentElement).appendChild(iframe);
    };

    if (window.webrtcDetectedBrowser === 'chrome') {
      AdapterJS.extensionInfo.chrome.iframeReloadFn();
    } else if (window.webrtcDetectedBrowser === 'opera') {
      console.warn('Opera does not support screensharing feature in getUserMedia');
    }

  } else if (navigator.mediaDevices && navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)) {
    // nothing here because edge does not support screensharing
    console.warn('Edge does not support screensharing feature in getUserMedia');

  } else {
    baseGetUserMedia = window.navigator.getUserMedia;

    navigator.getUserMedia = function (constraints, successCb, failureCb) {
      if (constraints && constraints.video && !!constraints.video.mediaSource) {
        // would be fine since no methods
        var updatedConstraints = clone(constraints);

        // wait for plugin to be ready
        AdapterJS.WebRTCPlugin.callWhenPluginReady(function() {
          // check if screensharing feature is available
          if (!!AdapterJS.WebRTCPlugin.plugin.HasScreensharingFeature &&
            !!AdapterJS.WebRTCPlugin.plugin.isScreensharingAvailable) {
            var sourceId = AdapterJS.WebRTCPlugin.plugin.screensharingKey || 'Screensharing';

            if (AdapterJS.WebRTCPlugin.plugin.screensharingKeys) {
              if (updatedConstraints.video.mediaSource === 'screen') {
                sourceId = AdapterJS.WebRTCPlugin.plugin.screensharingKeys.screen;
              } else if (updatedConstraints.video.mediaSource === 'window') {
                sourceId = AdapterJS.WebRTCPlugin.plugin.screensharingKeys.window;
              } else {
                sourceId = AdapterJS.WebRTCPlugin.plugin.screensharingKeys.screenOrWindow;
              }
            }

            // set the constraints
            updatedConstraints.video.optional = updatedConstraints.video.optional || [];
            updatedConstraints.video.optional.push({
              sourceId: sourceId
            });

            delete updatedConstraints.video.mediaSource;
          } else {
            failureCb(new Error('Your version of the WebRTC plugin does not support screensharing'));
            return;
          }
          baseGetUserMedia(updatedConstraints, successCb, failureCb);
        });
      } else {
        baseGetUserMedia(constraints, successCb, failureCb);
      }
    };

    AdapterJS.getUserMedia = getUserMedia =
       window.getUserMedia = navigator.getUserMedia;
    if ( navigator.mediaDevices &&
      typeof Promise !== 'undefined') {
      navigator.mediaDevices.getUserMedia = requestUserMedia;
    }
  }
};

if (typeof window.require !== 'function') {
  AdapterJS.defineMediaSourcePolyfill();
}
