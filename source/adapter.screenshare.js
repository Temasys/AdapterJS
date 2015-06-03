(function () {

  'use strict';

  var baseGetUserMedia = null;

  if (window.navigator.mozGetUserMedia) {
    baseGetUserMedia = window.navigator.getUserMedia;

    window.navigator.getUserMedia = function (constraints, successCb, failureCb) {
      constraints = constraints || {};

      if (constraints.video && !!constraints.video.mediaSource) {
        // intercepting screensharing requests

        constraints.video.mediaSource = 'window';
        constraints.video.mozMediaSource = 'window';

        baseGetUserMedia(constraints, successCb, function (error) {
          if (error.name === 'PermissionDeniedError' && window.parent.location.protocol === 'https:') {
            window.location.href = 'http://skylink.io/screensharing/ff_addon.php?domain=' + window.location.hostname;
          } else {
            failureCb(error);
          }
        })

      } else { // regular GetUserMediaRequest
        baseGetUserMedia(constraints, successCb, failureCb);
      }
    };

    window.getUserMedia = window.navigator.getUserMedia;

  } else if (window.navigator.webkitGetUserMedia) {
    baseGetUserMedia = window.navigator.getUserMedia;

    window.navigator.getUserMedia = function (constraints, successCb, failureCb) {
      constraints = constraints || {};

      if (constraints.video && !!constraints.video.mediaSource) {
        if (window.webrtcDetectedBrowser !== 'chrome') {
          throw new Error('Current browser does not support screensharing');
        }

        var chromeCallback = function(error, sourceId) {
          if(!error) {
            constraints.video.mandatory = constraints.video.mandatory || {};
            constraints.video.mandatory.chromeMediaSource = 'desktop';
            constraints.video.mandatory.maxWidth = window.screen.width > 1920 ? window.screen.width : 1920;
            constraints.video.mandatory.maxHeight = window.screen.height > 1080 ? window.screen.height : 1080;

            if (sourceId) {
              constraints.video.mandatory.chromeMediaSourceId = sourceId;
            }

            delete constraints.video.mediaSource;

            baseGetUserMedia(constraints, successCb, failureCb);

          } else {
            if (error === 'permission-denied') {
              throw new Error('Permission denied for screen retrieval');
            } else {
              throw new Error('Failed retrieving selected screen');
            }
          }
        };

        var onIFrameCallback = function (event) {
          if (!event.data) {
            return;
          }

          if (event.data.chromeMediaSourceId) {
            if (event.data.chromeMediaSourceId === 'PermissionDeniedError') {
                chromeCallback('permission-denied');
            } else {
              chromeCallback(null, event.data.chromeMediaSourceId);
            }
          }

          if (event.data.chromeExtensionStatus) {
            chromeCallback(event.data.chromeExtensionStatus, null);
          }

          // this event listener is no more needed
          window.removeEventListener('message', onIFrameCallback);
        };

        window.addEventListener('message', onIFrameCallback);

        postFrameMessage({
          captureSourceId: true
        });

      } else {
        baseGetUserMedia(constraints, successCb, failureCb);
      }
    };

    window.getUserMedia = window.navigator.getUserMedia;

  } else {
    baseGetUserMedia = window.navigator.getUserMedia;

    window.navigator.getUserMedia = function (constraints, successCb, failureCb) {
      constraints = constraints || {};

      if (constraints.video && !!constraints.video.mediaSource) {
        // check if plugin is ready
        if(AdapterJS.WebRTCPlugin.pluginState === AdapterJS.WebRTCPlugin.PLUGIN_STATES.READY) {
          // TODO: use AdapterJS.WebRTCPlugin.callWhenPluginReady instead

          // check if screensharing feature is available
          if (!!AdapterJS.WebRTCPlugin.plugin.HasScreensharingFeature &&
            !!AdapterJS.WebRTCPlugin.plugin.isScreensharingAvailable) {
            // set the constraints
            constraints.video.optional = constraints.video.optional || [];
            constraints.video.optional.push({
              sourceId: AdapterJS.WebRTCPlugin.plugin.screensharingKey || 'Screensharing'
            });

            delete constraints.video.mediaSource;
          } else {
            throw new Error('The plugin installed does not support screensharing');
          }
        } else {
          throw new Error('The plugin is currently not yet available');
        }
      }

      baseGetUserMedia(constraints, successCb, failureCb);
    };

    window.getUserMedia = window.navigator.getUserMedia;
  }

  if (window.webrtcDetectedBrowser === 'chrome') {
    var iframe = document.createElement('iframe');

    iframe.onload = function() {
      iframe.isLoaded = true;
    };

    iframe.src = 'https://cdn.temasys.com.sg/skylink/extensions/detection-script/detectRTC.html';
      //'https://temasys-cdn.s3.amazonaws.com/skylink/extensions/detection-script-dev/detectRTC.html';
    iframe.style.display = 'none';

    (document.body || document.documentElement).appendChild(iframe);

    var postFrameMessage = function (object) {
      object = object || {};

      if (!iframe.isLoaded) {
        setTimeout(function () {
          iframe.contentWindow.postMessage(object, '*');
        }, 100);
        return;
      }

      iframe.contentWindow.postMessage(object, '*');
    };
  }
})();