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
    // Flag for extension versions that does not honor the "mediaSource" flag
    legacy: true,
    // Deprecated! Define this to use iframe method
    iframeLink: 'https://cdn.temasys.com.sg/skylink/extensions/detectRTC.html',
    // Invoke this again if AdapterJS.extensionInfo is defined later with a different iframeLink
    reloadIFrame: null
  },
  // Required only for Firefox 51 and below
  firefox: {
    extensionLink: 'https://addons.mozilla.org/en-US/firefox/addon/skylink-webrtc-tools/'
  },
  opera: {
    extensionId: 'jbjibcfdghfanokgdpaohadjdaegfhij',
    extensionLink: 'https://addons.opera.com/extensions/details/temasys-webrtc-tools'
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
      // Append checks for overrides as these are mandatory
      // Browsers (not Firefox since they went Promise based) does these checks and they can be quite useful
      if (!(constraints && typeof constraints === 'object')) {
        throw new Error('GetUserMedia: (constraints, .., ..) argument required');
      } else if (typeof successCb !== 'function') {
        throw new Error('GetUserMedia: (.., successCb, ..) argument required');
      } else if (typeof failureCb !== 'function') {
        throw new Error('GetUserMedia: (.., .., failureCb) argument required');
      }

      // Prevent accessing property from Boolean errors
      if (constraints.video && typeof constraints.video === 'object' &&
        constraints.video.hasOwnProperty('mediaSource')) {
        var updatedConstraints = clone(constraints);
        // See: http://fluffy.github.io/w3c-screen-share/#screen-based-video-constraints
        // See also: https://bugzilla.mozilla.org/show_bug.cgi?id=1037405
        var mediaSourcesList = ['screen', 'window', 'application', 'browser', 'camera'];
        var useExtensionErrors = ['NotAllowedError', 'PermissionDeniedError', 'SecurityError'];

        // Obtain first item in array if array is provided
        if (Array.isArray(updatedConstraints.video.mediaSource)) {
          var i = 0;
          while (i < updatedConstraints.video.mediaSource.length) {
            if (mediaSourcesList.indexOf(updatedConstraints.video.mediaSource[i]) > -1) {
              updatedConstraints.video.mediaSource = updatedConstraints.video.mediaSource[i];
              break;
            }
            i++;
          }
          updatedConstraints.video.mediaSource = typeof updatedConstraints.video.mediaSource === 'string' ?
            updatedConstraints.video.mediaSource : null;
        }

        // Invalid mediaSource for firefox, only "screen" and "window" are supported
        if (mediaSourcesList.indexOf(updatedConstraints.video.mediaSource) === -1) {
          failureCb(new Error('GetUserMedia: Only "screen" and "window" are supported as mediaSource constraints'));
          return;
        }

        // Apparently requires document.readyState to be completed before the getUserMedia() could be invoked
        // NOTE: Doesn't make sense but let's keep it that way for now
        var checkIfReady = setInterval(function () {
          if (document.readyState !== 'complete') {
            return;
          }

          clearInterval(checkIfReady);
          updatedConstraints.video.mozMediaSource = updatedConstraints.video.mediaSource;

          baseGetUserMedia(updatedConstraints, successCb, function (error) {
            // Reference: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
            // Firefox 51 and below throws the following errors when screensharing is disabled, in which we can
            //   trigger installation for legacy extension (which no longer can be used) to enable screensharing
            if (useExtensionErrors.indexOf(error.name) > -1 &&
            // Note that "https:" should be required for screensharing 
              window.webrtcDetectedVersion < 52 && window.parent.location.protocol === 'https:') {
              // Render the notification bar to install legacy Firefox (for 51 and below) extension
              AdapterJS.renderNotificationBar(AdapterJS.TEXT.EXTENSION.REQUIRE_INSTALLATION_FF,
                AdapterJS.TEXT.EXTENSION.BUTTON_FF, function (e) {
                // Render the refresh bar once the user clicks to install extension from addons store
                window.open(AdapterJS.extensionInfo.firefox.extensionLink, '_blank');
                if (e.target && e.target.parentElement && e.target.nextElementSibling &&
                  e.target.nextElementSibling.click) {
                  e.target.nextElementSibling.click();
                }
                AdapterJS.renderNotificationBar(AdapterJS.TEXT.EXTENSION ?
                  AdapterJS.TEXT.EXTENSION.REQUIRE_REFRESH : AdapterJS.TEXT.REFRESH.REQUIRE_REFRESH,
                  AdapterJS.TEXT.REFRESH.BUTTON, function () {
                  window.open('javascript:location.reload()', '_top');
                });
              });
            } else {
              failureCb(error);
            }
          });
        }, 1);
      // Regular getUserMedia() call
      } else {
        baseGetUserMedia(constraints, successCb, failureCb);
      }
    };

    AdapterJS.getUserMedia = window.getUserMedia = navigator.getUserMedia;
    // Comment out to prevent recursive errors as webrtc/adapter polyfills navigator.getUserMedia and calls
    //   navigator.mediaDevices.getUserMedia internally
    /*navigator.mediaDevices.getUserMedia = function(constraints) {
      return new Promise(function(resolve, reject) {
        window.getUserMedia(constraints, resolve, reject);
      });
    };*/

  } else if (window.navigator.webkitGetUserMedia && window.webrtcDetectedBrowser !== 'safari') {
    baseGetUserMedia = window.navigator.getUserMedia;
    var iframe = document.createElement('iframe');

    navigator.getUserMedia = function (constraints, successCb, failureCb) {
      // Append checks for overrides as these are mandatory
      // Browsers (not Firefox since they went Promise based) does these checks and they can be quite useful
      if (!(constraints && typeof constraints === 'object')) {
        throw new Error('GetUserMedia: (constraints, .., ..) argument required');
      } else if (typeof successCb !== 'function') {
        throw new Error('GetUserMedia: (.., successCb, ..) argument required');
      } else if (typeof failureCb !== 'function') {
        throw new Error('GetUserMedia: (.., .., failureCb) argument required');
      }

      // Prevent accessing property from Boolean errors
      if (constraints.video && typeof constraints.video === 'object' && constraints.video.hasOwnProperty('mediaSource')) {
        var updatedConstraints = clone(constraints);
        // See: https://developer.chrome.com/extensions/desktopCapture#type-DesktopCaptureSourceType
        var mediaSourcesList = ['window', 'screen', 'tab', 'audio'];

        // Check against non valid sources
        if (typeof updatedConstraints.video.mediaSource === 'string' &&
          mediaSourcesList.indexOf(updatedConstraints.video.mediaSource) > -1 &&
          updatedConstraints.video.mediaSource !== 'audio') {
          updatedConstraints.video.mediaSource = [updatedConstraints.video.mediaSource];
        // Loop array and remove invalid sources
        } else if (Array.isArray(updatedConstraints.video.mediaSource)) {
          var i = 0;
          var outputMediaSource = [];
          while (i < mediaSourcesList.length) {
            var j = 0;
            while (j < updatedConstraints.video.mediaSource.length) {
              if (mediaSourcesList[i] === updatedConstraints.video.mediaSource[j]) {
                outputMediaSource.push(updatedConstraints.video.mediaSource[j]);
              }
              j++;
            }
            i++;
          }
          updatedConstraints.video.mediaSource = outputMediaSource;
        } else {
          updatedConstraints.video.mediaSource = [];
        }

        // Check against returning "audio" or ["audio"] without "tab"
        if (updatedConstraints.video.mediaSource.indexOf('audio') > -1 &&
          updatedConstraints.video.mediaSource.indexOf('tab') === -1) {
          failureCb(new Error('GetUserMedia: "audio" mediaSource must be provided with ["audio", "tab"]'));
          return;
        // No valid sources specified
        } else if (updatedConstraints.video.mediaSource.length === 0) {
          failureCb(new Error('GetUserMedia: Only "screen", "window", "tab" are supported as mediaSource constraints'));
          return;
        // Warn users that no tab audio will be used because constraints.audio must be enabled
        } else if (updatedConstraints.video.mediaSource.indexOf('tab') > -1 &&
          updatedConstraints.video.mediaSource.indexOf('audio') > -1 && !updatedConstraints.audio) {
          console.warn('Audio must be requested if "tab" and "audio" mediaSource constraints is requested');
        }

        var fetchStream = function (response) {
          if (response.success) {
            updatedConstraints.video.mandatory = updatedConstraints.video.mandatory || {};
            updatedConstraints.video.mandatory.chromeMediaSource = 'desktop';
            updatedConstraints.video.mandatory.maxWidth = window.screen.width > 1920 ? window.screen.width : 1920;
            updatedConstraints.video.mandatory.maxHeight = window.screen.height > 1080 ? window.screen.height : 1080;
            updatedConstraints.video.mandatory.chromeMediaSourceId = response.sourceId;

            if (Array.isArray(updatedConstraints.video.mediaSource) &&
              updatedConstraints.video.mediaSource.indexOf('tab') > -1 &&
              updatedConstraints.video.mediaSource.indexOf('audio') > -1 && updatedConstraints.audio) {
              updatedConstraints.audio = typeof updatedConstraints.audio === 'object' ? updatedConstraints.audio : {};
              updatedConstraints.audio.mandatory = updatedConstraints.audio.mandatory || {};
              updatedConstraints.audio.mandatory.chromeMediaSource = 'desktop';
              updatedConstraints.audio.mandatory.chromeMediaSourceId = response.sourceId;
            }

            delete updatedConstraints.video.mediaSource;
            baseGetUserMedia(updatedConstraints, successCb, failureCb);
          } else {
            // Extension not installed, trigger to install
            if (response.extensionLink) {
              // Render the notification bar to install extension
              AdapterJS.renderNotificationBar(AdapterJS.TEXT.EXTENSION.REQUIRE_INSTALLATION_CHROME,
                AdapterJS.TEXT.EXTENSION.BUTTON_CHROME, function (e) {
                // Render the refresh bar once the user clicks to install extension from addons store
                window.open(response.extensionLink, '_blank');
                if (e.target && e.target.parentElement && e.target.nextElementSibling &&
                  e.target.nextElementSibling.click) {
                  e.target.nextElementSibling.click();
                }
                AdapterJS.renderNotificationBar(AdapterJS.TEXT.EXTENSION ?
                  AdapterJS.TEXT.EXTENSION.REQUIRE_REFRESH : AdapterJS.TEXT.REFRESH.REQUIRE_REFRESH,
                  AdapterJS.TEXT.REFRESH.BUTTON, function () {
                  window.open('javascript:location.reload()', '_top');
                });
              });
            }
            failureCb(response.error);
          }
        };

        // Communicate with detectRTC (iframe) method to retrieve source ID
        // Opera browser should not use iframe method
        if (AdapterJS.extensionInfo.chrome.iframeLink && window.webrtcDetectedBrowser !== 'opera') {
          iframe.getSourceId(updatedConstraints.video.mediaSource, fetchStream);
        // Communicate with extension directly (needs updated extension code)
        } else {
          var extensionId = AdapterJS.extensionInfo[window.webrtcDetectedBrowser === 'opera' ? 'opera' : 'chrome'].extensionId;
          var extensionLink = AdapterJS.extensionInfo[window.webrtcDetectedBrowser === 'opera' ? 'opera' : 'chrome'].extensionLink;
          var icon = document.createElement('img');
          icon.src = 'chrome-extension://' + extensionId + '/icon.png';

          icon.onload = function() {
            // Check if extension is enabled, it should return data
            chrome.runtime.sendMessage(extensionId, {
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
              // Retrieve source ID
              chrome.runtime.sendMessage(extensionId, {
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

          // Extension icon didn't load so extension was not installed
          icon.onerror = function () {
            fetchStream({
              success: false,
              error: new Error('Extension not installed'),
              extensionLink: extensionLink
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
        try {
          window.getUserMedia(constraints, resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
    };

    // Save the loading of iframe into a function so users can invoke this later when
    //   the iframe settings is defined after AdapterJS is loaded.
    AdapterJS.extensionInfo.chrome.reloadIFrame = function () {
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

      // Do not need to load iframe as it is not requested
      if (!AdapterJS.extensionInfo.chrome.iframeLink) {
        return;
      }

      iframe.onload = function() {
        states.loaded = true;
      };

      iframe.onerror = function () {
        states.error = true;
      };

      iframe.src = AdapterJS.extensionInfo.chrome.iframeLink;
      iframe.style.display = 'none';

      // Listen to iframe messages
      var getSourceIdFromIFrame = function (sources, cb) {
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
          legacy: AdapterJS.extensionInfo.chrome.legacy,
          extensionId: AdapterJS.extensionInfo.chrome.extensionId,
          extensionLink: AdapterJS.extensionInfo.chrome.extensionLink
        }, '*');
      };

      // The function to communicate with iframe
      iframe.getSourceId = function (sources, cb) {
        // If iframe failed to load, ignore
        if (states.error) {
          cb({
            success: false,
            error: new Error('iframe is not loaded')
          });
          return;
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
              getSourceIdFromIFrame(sources, cb);
            }
          }, 100);
        } else {
          getSourceIdFromIFrame(sources, cb);
        }
      };

      // Re-append to reload
      (document.body || document.documentElement).appendChild(iframe);
    };

    // Start loading the iframe
    if (window.webrtcDetectedBrowser === 'chrome') {
      AdapterJS.extensionInfo.chrome.reloadIFrame();
    }

  } else if (navigator.mediaDevices && navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)) {
    baseGetUserMedia = window.navigator.getUserMedia;

    navigator.getUserMedia = function (constraints, successCb, failureCb) {
      // Append checks for overrides as these are mandatory
      // Browsers (not Firefox since they went Promise based) does these checks and they can be quite useful
      if (!(constraints && typeof constraints === 'object')) {
        throw new Error('GetUserMedia: (constraints, .., ..) argument required');
      } else if (typeof successCb !== 'function') {
        throw new Error('GetUserMedia: (.., successCb, ..) argument required');
      } else if (typeof failureCb !== 'function') {
        throw new Error('GetUserMedia: (.., .., failureCb) argument required');
      }

      if (constraints.video && typeof constraints.video === 'string' && constraints.video.hasOwnProperty('mediaSource')) {
        failureCb(new Error('Current browser does not support screensharing'));
        return;
      }

      baseGetUserMedia(constraints, successCb, failureCb);
    };

    AdapterJS.getUserMedia = window.getUserMedia = navigator.getUserMedia;
    navigator.mediaDevices.getUserMedia = function(constraints) {
      return new Promise(function(resolve, reject) {
        try {
          window.getUserMedia(constraints, resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
    };

    // Nothing here because edge does not support screensharing
    console.warn('Edge does not support screensharing feature in getUserMedia');

  } else {
    baseGetUserMedia = window.navigator.getUserMedia;

    navigator.getUserMedia = function (constraints, successCb, failureCb) {
      // Append checks for overrides as these are mandatory
      // Browsers (not Firefox since they went Promise based) does these checks and they can be quite useful
      if (!(constraints && typeof constraints === 'object')) {
        throw new Error('GetUserMedia: (constraints, .., ..) argument required');
      } else if (typeof successCb !== 'function') {
        throw new Error('GetUserMedia: (.., successCb, ..) argument required');
      } else if (typeof failureCb !== 'function') {
        throw new Error('GetUserMedia: (.., .., failureCb) argument required');
      }

      if (constraints.video && typeof constraints.video === 'string' && constraints.video.hasOwnProperty('mediaSource')) {
        var updatedConstraints = clone(constraints);

        // Wait for plugin to be ready
        AdapterJS.WebRTCPlugin.callWhenPluginReady(function() {
          // Check if screensharing feature is available
          if (!!AdapterJS.WebRTCPlugin.plugin.HasScreensharingFeature && !!AdapterJS.WebRTCPlugin.plugin.isScreensharingAvailable) {
            // Do strict checks for the source ID - "screen", "window" or ["screen", "window"]
            var sourceId = AdapterJS.WebRTCPlugin.plugin.screensharingKey || 'Screensharing';

            if (AdapterJS.WebRTCPlugin.plugin.screensharingKeys) {
              // Param: ["screen", "window"]
              if (Array.isArray(updatedConstraints.video.mediaSource) && 
                updatedConstraints.video.mediaSource.indexOf('screen') > -1 &&
                updatedConstraints.video.mediaSource.indexOf('window') > -1) {
                sourceId = AdapterJS.WebRTCPlugin.plugin.screensharingKeys.screenOrWindow;
              // Param: ["screen"] or "screen"
              } else if ((Array.isArray(updatedConstraints.video.mediaSource) && 
                updatedConstraints.video.mediaSource.indexOf('screen') > -1) || updatedConstraints.video.mediaSource === 'screen') {
                sourceId = AdapterJS.WebRTCPlugin.plugin.screensharingKeys.screen;
              // Param: ["window"] or "window"
              } else if ((Array.isArray(updatedConstraints.video.mediaSource) && 
                updatedConstraints.video.mediaSource.indexOf('window') > -1) || updatedConstraints.video.mediaSource === 'window') {
                sourceId = AdapterJS.WebRTCPlugin.plugin.screensharingKeys.window;
              } else {
                failureCb(new Error('GetUserMedia: Only "screen", "window", ["screen", "window"] are supported as mediaSource constraints'));
                return;
              }
            }

            updatedConstraints.video.optional = updatedConstraints.video.optional || [];
            updatedConstraints.video.optional.push({ sourceId: sourceId });
            delete updatedConstraints.video.mediaSource;

            baseGetUserMedia(updatedConstraints, successCb, failureCb);

          } else {
            failureCb(new Error('Your version of the WebRTC plugin does not support screensharing'));
            return;
          }
        });
      } else {
        baseGetUserMedia(constraints, successCb, failureCb);
      }
    };

    AdapterJS.getUserMedia = getUserMedia = window.getUserMedia = navigator.getUserMedia;
    if (navigator.mediaDevices && typeof Promise !== 'undefined') {
      navigator.mediaDevices.getUserMedia = requestUserMedia;
    }
  }
};

if (typeof window.require !== 'function') {
  AdapterJS.defineMediaSourcePolyfill();
}