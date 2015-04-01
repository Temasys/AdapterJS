/*! adapterjs - v0.10.5 - 2015-04-01 */

/*
 *  Copyright (c) 2014 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/* More information about these options at jshint.com/docs/options */
/* global mozRTCIceCandidate, mozRTCPeerConnection,
mozRTCSessionDescription, webkitRTCPeerConnection */
/* exported trace,requestUserMedia */

'use strict';

var RTCPeerConnection = null;
var getUserMedia = null;
var attachMediaStream = null;
var reattachMediaStream = null;
var webrtcDetectedBrowser = null;
var webrtcDetectedVersion = null;

function trace(text) {
  // This function is used for logging.
  if (text[text.length - 1] === '\n') {
    text = text.substring(0, text.length - 1);
  }
  if (window.performance) {
    var now = (window.performance.now() / 1000).toFixed(3);
    console.log(now + ': ' + text);
  } else {
    console.log(text);
  }
}

if (navigator.mozGetUserMedia) {
  console.log('This appears to be Firefox');

  webrtcDetectedBrowser = 'firefox';

  webrtcDetectedVersion =
    parseInt(navigator.userAgent.match(/Firefox\/([0-9]+)\./)[1], 10);

  // The RTCPeerConnection object.
  RTCPeerConnection = function(pcConfig, pcConstraints) {
    // .urls is not supported in FF yet.
    if (pcConfig && pcConfig.iceServers) {
      for (var i = 0; i < pcConfig.iceServers.length; i++) {
        if (pcConfig.iceServers[i].hasOwnProperty('urls')) {
          pcConfig.iceServers[i].url = pcConfig.iceServers[i].urls;
          delete pcConfig.iceServers[i].urls;
        }
      }
    }
    return new mozRTCPeerConnection(pcConfig, pcConstraints);
  };

  // The RTCSessionDescription object.
  window.RTCSessionDescription = mozRTCSessionDescription;

  // The RTCIceCandidate object.
  window.RTCIceCandidate = mozRTCIceCandidate;

  // getUserMedia shim (only difference is the prefix).
  // Code from Adam Barth.
  getUserMedia = navigator.mozGetUserMedia.bind(navigator);
  navigator.getUserMedia = getUserMedia;

  // Shim for MediaStreamTrack.getSources.
  MediaStreamTrack.getSources = function(successCb) {
    setTimeout(function() {
      var infos = [
        {kind: 'audio', id: 'default', label:'', facing:''},
        {kind: 'video', id: 'default', label:'', facing:''}
      ];
      successCb(infos);
    }, 0);
  };

  // Creates ICE server from the URL for FF.
  window.createIceServer = function(url, username, password) {
    var iceServer = null;
    var urlParts = url.split(':');
    if (urlParts[0].indexOf('stun') === 0) {
      // Create ICE server with STUN URL.
      iceServer = {
        'url': url
      };
    } else if (urlParts[0].indexOf('turn') === 0) {
      if (webrtcDetectedVersion < 27) {
        // Create iceServer with turn url.
        // Ignore the transport parameter from TURN url for FF version <=27.
        var turnUrlParts = url.split('?');
        // Return null for createIceServer if transport=tcp.
        if (turnUrlParts.length === 1 ||
          turnUrlParts[1].indexOf('transport=udp') === 0) {
          iceServer = {
            'url': turnUrlParts[0],
            'credential': password,
            'username': username
          };
        }
      } else {
        // FF 27 and above supports transport parameters in TURN url,
        // So passing in the full url to create iceServer.
        iceServer = {
          'url': url,
          'credential': password,
          'username': username
        };
      }
    }
    return iceServer;
  };

  window.createIceServers = function(urls, username, password) {
    var iceServers = [];
    // Use .url for FireFox.
    for (var i = 0; i < urls.length; i++) {
      var iceServer =
        window.createIceServer(urls[i], username, password);
      if (iceServer !== null) {
        iceServers.push(iceServer);
      }
    }
    return iceServers;
  };

  // Attach a media stream to an element.
  attachMediaStream = function(element, stream) {
    console.log('Attaching media stream');
    element.mozSrcObject = stream;
  };

  reattachMediaStream = function(to, from) {
    console.log('Reattaching media stream');
    to.mozSrcObject = from.mozSrcObject;
  };

} else if (navigator.webkitGetUserMedia) {
  console.log('This appears to be Chrome');

  webrtcDetectedBrowser = 'chrome';
  // Temporary fix until crbug/374263 is fixed.
  // Setting Chrome version to 999, if version is unavailable.
  var result = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
  if (result !== null) {
    webrtcDetectedVersion = parseInt(result[2], 10);
  } else {
    webrtcDetectedVersion = 999;
  }

  // Creates iceServer from the url for Chrome M33 and earlier.
  window.createIceServer = function(url, username, password) {
    var iceServer = null;
    var urlParts = url.split(':');
    if (urlParts[0].indexOf('stun') === 0) {
      // Create iceServer with stun url.
      iceServer = {
        'url': url
      };
    } else if (urlParts[0].indexOf('turn') === 0) {
      // Chrome M28 & above uses below TURN format.
      iceServer = {
        'url': url,
        'credential': password,
        'username': username
      };
    }
    return iceServer;
  };

  // Creates an ICEServer object from multiple URLs.
  window.createIceServers = function(urls, username, password) {
    return {
      'urls': urls,
      'credential': password,
      'username': username
    };
  };

  // The RTCPeerConnection object.
  RTCPeerConnection = function(pcConfig, pcConstraints) {
    return new webkitRTCPeerConnection(pcConfig, pcConstraints);
  };

  // Get UserMedia (only difference is the prefix).
  // Code from Adam Barth.
  getUserMedia = navigator.webkitGetUserMedia.bind(navigator);
  navigator.getUserMedia = getUserMedia;

  // Attach a media stream to an element.
  attachMediaStream = function(element, stream) {
    if (typeof element.srcObject !== 'undefined') {
      element.srcObject = stream;
    } else if (typeof element.mozSrcObject !== 'undefined') {
      element.mozSrcObject = stream;
    } else if (typeof element.src !== 'undefined') {
      element.src = URL.createObjectURL(stream);
    } else {
      console.log('Error attaching stream to element.');
    }
  };

  reattachMediaStream = function(to, from) {
    to.src = from.src;
  };
} else {
  console.log('Browser does not appear to be WebRTC-capable');
}

// Returns the result of getUserMedia as a Promise.
function requestUserMedia(constraints) {
  return new Promise(function(resolve, reject) {
    var onSuccess = function(stream) {
      resolve(stream);
    };
    var onError = function(error) {
      reject(error);
    };

    try {
      getUserMedia(constraints, onSuccess, onError);
    } catch (e) {
      reject(e);
    }
  });
}
/**
 * The Temasys AdapterJS interface.
 * @class AdapterJS
 * @since 0.10.5
 */
window.AdapterJS = typeof window.AdapterJS !== 'undefined' ? window.AdapterJS : {};

/**
 * Contains the options of the Temasys Plugin.
 * @property options
 * @param getAllCams {Boolean} Option to get virtual cameras.
 *   Override this value here.
 * @param hidePluginInstallPrompt {Boolean} Option to prevent
 *   the install prompt when the plugin in not yet installed.
 *   Override this value here.
 * @type JSON
 * @for AdapterJS
 * @since 0.10.5
 */
AdapterJS.options = {
  getAllCams: false,
  hidePluginInstallPrompt: false
};

/**
 * The current version of the Temasys AdapterJS.
 * @property VERSION.
 * @type String
 * @for AdapterJS
 * @since 0.10.5
 */
AdapterJS.VERSION = '0.10.5';

/**
 * The event function that will be called when the WebRTC API is
 *   ready to be used in cross-browsers.
 * If you decide not to override use this synchronisation, it may result in
 *   an extensive CPU usage on the plugin start (once per tab loaded).
 * Override this function to synchronise the start of your application
 *   with the WebRTC API being ready.
 * @property onwebrtcready
 * @return {Boolean} Returns a boolean in the event function that
 *   indicates if the WebRTC plugin is being used, false otherwise.
 * @type Function
 * @for AdapterJS
 * @since 0.10.5
 */
AdapterJS.onwebrtcready = AdapterJS.onwebrtcready || function (isUsingPlugin) {};

/**
 * Checks if maybe WebRTC is already ready.
 * @property maybeThroughWebRTCReady
 * @type Function
 * @private
 * @for AdapterJS
 * @since 0.10.5
 */
AdapterJS.maybeThroughWebRTCReady = function () {
  if (!AdapterJS.onwebrtcreadyDone) {
    AdapterJS.onwebrtcreadyDone = true;

    if (typeof AdapterJS.onwebrtcready === 'function') {
      AdapterJS.onwebrtcready(AdapterJS.WebRTCPlugin.plugin !== null);
    }
  }
};

/**
 * The result of ICE connection states.
 * @property _iceConnectionStates
 * @param {String} starting ICE connection is starting.
 * @param {String} checking ICE connection is checking.
 * @param {String} connected ICE connection is connected.
 * @param {String} completed ICE connection is connected.
 * @param {String} done ICE connection has been completed.
 * @param {String} disconnected ICE connection has been disconnected.
 * @param {String} failed ICE connection has failed.
 * @param {String} closed ICE connection is closed.
 * @type JSON
 * @readOnly
 * @private
 * @for AdapterJS
 * @since 0.10.5
 */
AdapterJS._iceConnectionStates = {
  starting : 'starting',
  checking : 'checking',
  connected : 'connected',
  completed : 'connected',
  done : 'completed',
  disconnected : 'disconnected',
  failed : 'failed',
  closed : 'closed'
};

/**
 * The IceConnection states that has been fired for each peer.
 * @property _iceConnectionFiredStates
 * @param {Array} (#peerId) The ICE connection fired states for this peerId.
 * @type Array
 * @private
 * @for AdapterJS
 * @since 0.10.5
 */
AdapterJS._iceConnectionFiredStates = [];

/**
 * Check if WebRTC Interface is defined.
 * @property isDefined
 * @type Boolean
 * @readOnly
 * @private
 * @for AdapterJS
 * @since 0.10.5
 */
AdapterJS.isDefined = null;

/**
 * This function helps to retrieve the webrtc detected browser information.
 * This sets:
 * webrtcDetectedBrowser: The browser agent name.
 * - webrtcDetectedVersion: The browser version.
 * - webrtcDetectedType: The types of webRTC support.
 *   - 'moz': Mozilla implementation of webRTC.
 *   - 'webkit': WebKit implementation of webRTC.
 *   - 'plugin': Using the plugin implementation.
 * @property parseWebrtcDetectedBrowser
 * @type Function
 * @private
 * @for AdapterJS
 * @since 0.10.5
 */
AdapterJS.parseWebrtcDetectedBrowser = function () {
  var hasMatch, checkMatch = navigator.userAgent.match(
    /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  if (/trident/i.test(checkMatch[1])) {
    hasMatch = /\brv[ :]+(\d+)/g.exec(navigator.userAgent) || [];
    webrtcDetectedBrowser = 'IE';
    webrtcDetectedVersion = parseInt(hasMatch[1] || '0', 10);
  } else if (checkMatch[1] === 'Chrome') {
    hasMatch = navigator.userAgent.match(/\bOPR\/(\d+)/);
    if (hasMatch !== null) {
      webrtcDetectedBrowser = 'opera';
      webrtcDetectedVersion = parseInt(hasMatch[1], 10);
    }
  }
  if (navigator.userAgent.indexOf('Safari')) {
    if (typeof InstallTrigger !== 'undefined') {
      webrtcDetectedBrowser = 'firefox';
    } else if (/*@cc_on!@*/ false || !!document.documentMode) {
      webrtcDetectedBrowser = 'IE';
    } else if (
      Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0) {
      webrtcDetectedBrowser = 'safari';
    } else if (!!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) {
      webrtcDetectedBrowser = 'opera';
    } else if (!!window.chrome) {
      webrtcDetectedBrowser = 'chrome';
    }
  }
  if (!webrtcDetectedBrowser) {
    webrtcDetectedVersion = checkMatch[1];
  }
  if (!webrtcDetectedVersion) {
    try {
      checkMatch = (checkMatch[2]) ? [checkMatch[1], checkMatch[2]] :
        [navigator.appName, navigator.appVersion, '-?'];
      if ((hasMatch = navigator.userAgent.match(/version\/(\d+)/i)) !== null) {
        checkMatch.splice(1, 1, hasMatch[1]);
      }
      webrtcDetectedVersion = parseInt(checkMatch[1], 10);
    } catch (error) { }
  }
};

/**
 * To fix configuration as some browsers does not support
 *  the 'urls' attribute.
 * @property maybeFixConfiguration
 * @type Function
 * @private
 * @for AdapterJS
 * @since 0.10.5
 */
AdapterJS.maybeFixConfiguration = function (pcConfig) {
  if (pcConfig === null) {
    return;
  }
  for (var i = 0; i < pcConfig.iceServers.length; i++) {
    if (pcConfig.iceServers[i].hasOwnProperty('urls')) {
      pcConfig.iceServers[i].url = pcConfig.iceServers[i].urls;
      delete pcConfig.iceServers[i].urls;
    }
  }
};

/**
 * Adds an event listener for Temasys plugin objects.
 * @property addEvent
 * @type Function
 * @private
 * @for AdapterJS
 * @since 0.10.5
 */
AdapterJS.addEvent = function(elem, evnt, func) {
  if (elem.addEventListener) { // W3C DOM
    elem.addEventListener(evnt, func, false);
  } else if (elem.attachEvent) {// OLD IE DOM
    elem.attachEvent('on' + evnt, func);
  } else { // No much to do
    elem[evnt] = func;
  }
};

/**
 * Detected webrtc implementation. Types are:
 * - 'moz': Mozilla implementation of webRTC.
 * - 'webkit': WebKit implementation of webRTC.
 * - 'plugin': Using the plugin implementation.
 * @property webrtcDetectedType
 * @type String
 * @readOnly
 * @for AdapterJS
 * @since 0.10.5
 */
window.webrtcDetectedType = null;

/**
 * Detected webrtc datachannel support. Types are:
 * - 'SCTP': SCTP datachannel support.
 * - 'RTP': RTP datachannel support.
 * @property webrtcDetectedType
 * @type String
 * @readOnly
 * @for AdapterJS
 * @since 0.10.5
 */
window.webrtcDetectedDCSupport = null;

/**
 * Set the settings for creating DataChannels, MediaStream for
 *   Cross-browser compability. This is only for SCTP based support browsers.
 * @method checkMediaDataChannelSettings
 * @param {String} peerBrowserAgent The browser agent name.
 * @param {Integer} peerBrowserVersion The browser agent version.
 * @param {Function} callback The callback that gets fired once the function is
 *   completed.
 * @param {JSON} constraints The RTCOfferOptions.
 * @return {Boolean & JSON} (beOfferer, updatedConstraints)
 *   Returns a flag beOfferer if the peer should be the offer and also the updated unified
 *   RTCOfferOptions constraints.
 * @readOnly
 * @global true
 * @for AdapterJS
 * @since 0.10.5
 */
window.checkMediaDataChannelSettings = function (peerBrowserAgent, peerBrowserVersion, callback, constraints) {
  if (typeof callback !== 'function') {
    return;
  }
  var beOfferer = true;
  var isLocalFirefox = webrtcDetectedBrowser === 'firefox';
  // Nightly version does not require MozDontOfferDataChannel for interop
  var isLocalFirefoxInterop = webrtcDetectedType === 'moz' && webrtcDetectedVersion > 30;
  var isPeerFirefox = peerBrowserAgent === 'firefox';
  var isPeerFirefoxInterop = peerBrowserAgent === 'firefox' &&
    ((peerBrowserVersion) ? (peerBrowserVersion > 30) : false);

  // Resends an updated version of constraints for MozDataChannel to work
  // If other userAgent is firefox and user is firefox, remove MozDataChannel
  if ((isLocalFirefox && isPeerFirefox) || (isLocalFirefoxInterop)) {
    try {
      delete constraints.mandatory.MozDontOfferDataChannel;
    } catch (error) {
      console.error('Failed deleting MozDontOfferDataChannel');
      console.error(error);
    }
  } else if ((isLocalFirefox && !isPeerFirefox)) {
    constraints.mandatory.MozDontOfferDataChannel = true;
  }
  if (!isLocalFirefox) {
    // temporary measure to remove Moz* constraints in non Firefox browsers
    for (var prop in constraints.mandatory) {
      if (constraints.mandatory.hasOwnProperty(prop)) {
        if (prop.indexOf('Moz') !== -1) {
          delete constraints.mandatory[prop];
        }
      }
    }
  }
  // Firefox (not interopable) cannot offer DataChannel as it will cause problems to the
  // interopability of the media stream
  if (isLocalFirefox && !isPeerFirefox && !isLocalFirefoxInterop) {
    beOfferer = false;
  }
  callback(beOfferer, constraints);
};

/**
 * Handles the differences for all browsers ice connection state output.
 * Tested outcomes are:
 * - Chrome (offerer)  : 'checking' > 'completed' > 'completed'
 * - Chrome (answerer) : 'checking' > 'connected'
 * - Firefox (offerer) : 'checking' > 'connected'
 * - Firefox (answerer): 'checking' > 'connected'
 * @method checkIceConnectionState
 * @param {String} peerId The peerId of the peer to check.
 * @param {String} iceConnectionState The peer's current ICE connection state.
 * @param {String} callback The callback that returns the updated connected state.
 * @return {String} (state)
 * Returns the updated ICE connection state.
 * @for AdapterJS
 * @since 0.10.5
 */
window.checkIceConnectionState = function (peerId, iceConnectionState, callback) {
  if (typeof callback !== 'function') {
    console.warn('No callback specified in checkIceConnectionState. Aborted.');
    return;
  }
  peerId = (peerId) ? peerId : 'peer';

  if (!AdapterJS._iceConnectionFiredStates[peerId] ||
    iceConnectionState === AdapterJS._iceConnectionStates.disconnected ||
    iceConnectionState === AdapterJS._iceConnectionStates.failed ||
    iceConnectionState === AdapterJS._iceConnectionStates.closed) {
    AdapterJS._iceConnectionFiredStates[peerId] = [];
  }
  iceConnectionState = AdapterJS._iceConnectionStates[iceConnectionState];
  if (AdapterJS._iceConnectionFiredStates[peerId].indexOf(iceConnectionState) < 0) {
    AdapterJS._iceConnectionFiredStates[peerId].push(iceConnectionState);
    if (iceConnectionState === AdapterJS._iceConnectionStates.connected) {
      setTimeout(function () {
        AdapterJS._iceConnectionFiredStates[peerId]
          .push(AdapterJS._iceConnectionStates.done);
        callback(AdapterJS._iceConnectionStates.done);
      }, 1000);
    }
    callback(iceConnectionState);
  }
  return;
};
/**
 * The Temasys AdapterJS Plugin interface.
 * @class WebRTCPlugin
 * @for AdapterJS
 * @since 0.10.5
 */
AdapterJS.WebRTCPlugin = AdapterJS.WebRTCPlugin || {};

/**
 * Contains the plugin information.
 * @property pluginInfo
 * @param {String} prefix The plugin prefix name.
 * @param {String} plugName The plugin object name.
 * @param {String} pluginId The plugin object id.
 * @param {String} type The plugin object type.
 * @param {String} onload The Javascript function to trigger when
 *   the plugin object has loaded.
 * @param {String} portalLink The plugin website url.
 * @param {String} downloadLink The link to download new versions
 *   of the plugin.
 * @param {String} companyName The plugin company name.
 * @type JSON
 * @private
 * @readOnly
 * @for WebRTCPlugin
 * @since 0.10.5
 */
AdapterJS.WebRTCPlugin.pluginInfo = {
  prefix : 'Tem',
  plugName : 'TemWebRTCPlugin',
  pluginId : 'plugin0',
  type : 'application/x-temwebrtcplugin',
  onload : '__TemWebRTCReady0',
  portalLink : 'http://skylink.io/plugin/',
  downloadLink : (function () {
    // Placed on-top to return the url string directly instead
    if (!!navigator.platform.match(/^Mac/i)) {
      return 'http://bit.ly/1n77hco';
    } else if (!!navigator.platform.match(/^Win/i)) {
      return 'http://bit.ly/1kkS4FN';
    }
    return null;
  })(),
  companyName: 'Temasys'
};

/**
 * Contains the unique identifier of each opened page
 * @property pageId
 * @type String
 * @private
 * @readOnly
 * @for WebRTCPlugin
 * @since 0.10.5
 */
AdapterJS.WebRTCPlugin.pageId = Math.random().toString(36).slice(2);

/**
 * Use this whenever you want to call the plugin.
 * @property plugin
 * @type Object
 * @private
 * @readOnly
 * @for WebRTCPlugin
 * @since 0.10.5
 */
AdapterJS.WebRTCPlugin.plugin = null;

/**
 * Sets log level for the plugin once it is ready.
 * This is an asynchronous function that will run when the plugin is ready
 * @property setLogLevel
 * @type Function
 * @private
 * @for WebRTCPlugin
 * @since 0.10.5
 */
AdapterJS.WebRTCPlugin.setLogLevel = null; //function (logLevel) {};

/**
 * Defines webrtc's JS interface according to the plugin's implementation.
 * Define plugin Browsers as WebRTC Interface.
 * @property defineWebRTCInterface
 * @type Function
 * @private
 * @for WebRTCPlugin
 * @since 0.10.5
 */
AdapterJS.WebRTCPlugin.defineWebRTCInterface = null; //function () { };

/**
 * This function detects whether or not a plugin is installed.
 *   we're running IE and do something. If not it is not supported.
 * @property isPluginInstalled
 * @type Function
 * @readOnly
 * @for WebRTCPlugin
 * @since 0.10.5
 */
AdapterJS.WebRTCPlugin.isPluginInstalled = null; // function () { };

/**
 * Lets adapter.js wait until the the document is ready before injecting the plugin.
 * @property pluginInjectionInterval
 * @type Object
 * @private
 * @for WebRTCPlugin
 * @since 0.10.5
 */
AdapterJS.WebRTCPlugin.pluginInjectionInterval = null;

/**
 * Injects the HTML DOM object element into the page.
 * @property injectPlugin
 * @type Function
 * @private
 * @for WebRTCPlugin
 * @since 0.10.5
 */
AdapterJS.WebRTCPlugin.injectPlugin = null;

/**
 * States of readiness that the plugin goes through when being injected and stated.
 * @property PLUGIN_STATES
 * @param {Integer} NONE No plugin use
 * @param {Integer} INITIALIZING Detected need for plugin
 * @param {Integer} INJECTING Injecting plugin
 * @param {Integer} INJECTED Plugin element injected but not usable yet
 * @param {Integer} READY Plugin ready to be used
 * @type JSON
 * @readOnly
 * @for WebRTCPlugin
 * @since 0.10.5
 */
AdapterJS.WebRTCPlugin.PLUGIN_STATES = {
  NONE : 0,
  INITIALIZING : 1,
  INJECTING : 2,
  INJECTED: 3,
  READY: 4
};

/**
 * Current state of the plugin. You cannot use the plugin before this is
 *  equal to AdapterJS.WebRTCPlugin.PLUGIN_STATES.READY.
 * @property pluginState
 * @type Integer
 * @private
 * @for WebRTCPlugin
 * @since 0.10.5
 */
AdapterJS.WebRTCPlugin.pluginState = AdapterJS.WebRTCPlugin.PLUGIN_STATES.NONE;

/**
 * True is AdapterJS.onwebrtcready was already called, false otherwise.
 * Used to make sure AdapterJS.onwebrtcready is only called once.
 * @property onwebrtcreadyDone
 * @type Boolean
 * @readOnly
 * @for WebRTCPlugin
 * @since 0.10.5
 */
AdapterJS.onwebrtcreadyDone = false;

/**
 * Log levels for the plugin.
 * Log outputs are prefixed in some cases.
 * From the least verbose to the most verbose
 * @property PLUGIN_LOG_LEVELS
 * @param {String} NONE No log level.
 * @param {String} ERROR Errors originating from within the plugin.
 * @param {String} INFO Information reported by the plugin.
 * @param {String} VERBOSE Verbose mode.
 * @param {String} SENSITIVE Sensitive mode.
 * @type JSON
 * @readOnly
 * @private
 * @for WebRTCPlugin
 * @since 0.10.5
 */
AdapterJS.WebRTCPlugin.PLUGIN_LOG_LEVELS = {
  NONE : 'NONE',
  ERROR : 'ERROR',
  WARNING : 'WARNING',
  INFO: 'INFO',
  VERBOSE: 'VERBOSE',
  SENSITIVE: 'SENSITIVE'
};

/**
 * Does a waiting check before proceeding to load the plugin.
 * @property WaitForPluginReady
 * @type Function
 * @private
 * @for WebRTCPlugin
 * @since 0.10.5
 */
AdapterJS.WebRTCPlugin.WaitForPluginReady = null;

/**
 * This method will use an interval to wait for the plugin to be ready.
 * @property callWhenPluginReady
 * @type Function
 * @private
 * @for WebRTCPlugin
 * @since 0.10.5
 */
AdapterJS.WebRTCPlugin.callWhenPluginReady = null;

/**
 * This function will be called if the plugin is needed (browser different
 *   from Chrome or Firefox), but the plugin is not installed.
 * Override it according to your application logic.
 * @property pluginNeededButNotInstalledCb
 * @type Function
 * @for WebRTCPlugin
 * @since 0.10.5
 */
AdapterJS.WebRTCPlugin.pluginNeededButNotInstalledCb = null;

/**
 * !!!! WARNING: DO NOT OVERRIDE THIS FUNCTION. !!!
 * This function will be called when plugin is ready. It sends necessary
 *   details to the plugin.
 * The function will wait for the document to be ready and the set the
 *   plugin state to AdapterJS.WebRTCPlugin.PLUGIN_STATES.READY,
 *   indicating that it can start being requested.
 * This function is not in the IE/Safari condition brackets so that
 *   TemPluginLoaded function might be called on Chrome/Firefox.
 * This function is the only private function that is not encapsulated to
 *   allow the plugin method to be called.
 * @method pluginNeededButNotInstalledCb
 * @private
 * @global true
 * @for WebRTCPlugin
 * @since 0.10.5
 */
window.__TemWebRTCReady0 = function () {
  if (document.readyState === 'complete') {
    AdapterJS.WebRTCPlugin.pluginState = AdapterJS.WebRTCPlugin.PLUGIN_STATES.READY;

    AdapterJS.maybeThroughWebRTCReady();
  } else {
    AdapterJS.WebRTCPlugin.documentReadyInterval = setInterval(function () {
      if (document.readyState === 'complete') {
        // TODO: update comments, we wait for the document to be ready
        clearInterval(AdapterJS.WebRTCPlugin.documentReadyInterval);
        AdapterJS.WebRTCPlugin.pluginState = AdapterJS.WebRTCPlugin.PLUGIN_STATES.READY;

        AdapterJS.maybeThroughWebRTCReady();
      }
    }, 100);
  }
};
if (!navigator.mozGetUserMedia && !navigator.webkitGetUserMedia) {
  // IE 9 is not offering an implementation of console.log until you open a console
  if (typeof console !== 'object' || typeof console.log !== 'function') {
    /* jshint -W020 */
    console = {} || console;
    // Implemented based on console specs from MDN
    // You may override these functions
    console.log = function (arg) {};
    console.info = function (arg) {};
    console.error = function (arg) {};
    console.dir = function (arg) {};
    console.exception = function (arg) {};
    console.trace = function (arg) {};
    console.warn = function (arg) {};
    console.count = function (arg) {};
    console.debug = function (arg) {};
    console.count = function (arg) {};
    console.time = function (arg) {};
    console.timeEnd = function (arg) {};
    console.group = function (arg) {};
    console.groupCollapsed = function (arg) {};
    console.groupEnd = function (arg) {};
    /* jshint +W020 */
  }
  webrtcDetectedType = 'plugin';
  webrtcDetectedDCSupport = 'plugin';
  AdapterJS.parseWebrtcDetectedBrowser();
  var isIE = webrtcDetectedBrowser === 'IE';

  /* jshint -W035 */
  AdapterJS.WebRTCPlugin.WaitForPluginReady = function() {
    while (AdapterJS.WebRTCPlugin.pluginState !== AdapterJS.WebRTCPlugin.PLUGIN_STATES.READY) {
      /* empty because it needs to prevent the function from running. */
    }
  };
  /* jshint +W035 */

  AdapterJS.WebRTCPlugin.callWhenPluginReady = function (callback) {
    if (AdapterJS.WebRTCPlugin.pluginState === AdapterJS.WebRTCPlugin.PLUGIN_STATES.READY) {
      // Call immediately if possible
      // Once the plugin is set, the code will always take this path
      callback();
    } else {
      // otherwise start a 100ms interval
      var checkPluginReadyState = setInterval(function () {
        if (AdapterJS.WebRTCPlugin.pluginState === AdapterJS.WebRTCPlugin.PLUGIN_STATES.READY) {
          clearInterval(checkPluginReadyState);
          callback();
        }
      }, 100);
    }
  };

  AdapterJS.WebRTCPlugin.setLogLevel = function(logLevel) {
    AdapterJS.WebRTCPlugin.callWhenPluginReady(function() {
      AdapterJS.WebRTCPlugin.plugin.setLogLevel(logLevel);
    });
  };

  AdapterJS.WebRTCPlugin.injectPlugin = function () {
    // only inject once the page is ready
    if (document.readyState !== 'complete') {
      return;
    }

    // Prevent multiple injections
    if (AdapterJS.WebRTCPlugin.pluginState !== AdapterJS.WebRTCPlugin.PLUGIN_STATES.INITIALIZING) {
      return;
    }

    AdapterJS.WebRTCPlugin.pluginState = AdapterJS.WebRTCPlugin.PLUGIN_STATES.INJECTING;

    if (webrtcDetectedBrowser === 'IE' && webrtcDetectedVersion <= 10) {
      var frag = document.createDocumentFragment();
      AdapterJS.WebRTCPlugin.plugin = document.createElement('div');
      AdapterJS.WebRTCPlugin.plugin.innerHTML = '<object id="' +
        AdapterJS.WebRTCPlugin.pluginInfo.pluginId + '" type="' +
        AdapterJS.WebRTCPlugin.pluginInfo.type + '" ' + 'width="1" height="1">' +
        '<param name="pluginId" value="' +
        AdapterJS.WebRTCPlugin.pluginInfo.pluginId + '" /> ' +
        '<param name="windowless" value="false" /> ' +
        '<param name="pageId" value="' + AdapterJS.WebRTCPlugin.pageId + '" /> ' +
        '<param name="onload" value="' + AdapterJS.WebRTCPlugin.pluginInfo.onload +
        '" />' +
        // uncomment to be able to use virtual cams
        (AdapterJS.options.getAllCams ? '<param name="forceGetAllCams" value="True" />':'') +

        '</object>';
      while (AdapterJS.WebRTCPlugin.plugin.firstChild) {
        frag.appendChild(AdapterJS.WebRTCPlugin.plugin.firstChild);
      }
      document.body.appendChild(frag);

      // Need to re-fetch the plugin
      AdapterJS.WebRTCPlugin.plugin =
        document.getElementById(AdapterJS.WebRTCPlugin.pluginInfo.pluginId);
    } else {
      // Load Plugin
      AdapterJS.WebRTCPlugin.plugin = document.createElement('object');
      AdapterJS.WebRTCPlugin.plugin.id =
        AdapterJS.WebRTCPlugin.pluginInfo.pluginId;
      // IE will only start the plugin if it's ACTUALLY visible
      if (isIE) {
        AdapterJS.WebRTCPlugin.plugin.width = '1px';
        AdapterJS.WebRTCPlugin.plugin.height = '1px';
      }
      AdapterJS.WebRTCPlugin.plugin.type = AdapterJS.WebRTCPlugin.pluginInfo.type;
      AdapterJS.WebRTCPlugin.plugin.innerHTML = '<param name="onload" value="' +
        AdapterJS.WebRTCPlugin.pluginInfo.onload + '">' +
        '<param name="pluginId" value="' +
        AdapterJS.WebRTCPlugin.pluginInfo.pluginId + '">' +
        '<param name="windowless" value="false" /> ' +
        (AdapterJS.options.getAllCams ? '<param name="forceGetAllCams" value="True" />':'') +
        '<param name="pageId" value="' + AdapterJS.WebRTCPlugin.pageId + '">';
      document.body.appendChild(AdapterJS.WebRTCPlugin.plugin);
    }


    AdapterJS.WebRTCPlugin.pluginState = AdapterJS.WebRTCPlugin.PLUGIN_STATES.INJECTED;
  };

  AdapterJS.WebRTCPlugin.isPluginInstalled =
    function (comName, plugName, installedCb, notInstalledCb) {
    if (!isIE) {
      var pluginArray = navigator.plugins;
      for (var i = 0; i < pluginArray.length; i++) {
        if (pluginArray[i].name.indexOf(plugName) >= 0) {
          installedCb();
          return;
        }
      }
      notInstalledCb();
    } else {
      try {
        var axo = new ActiveXObject(comName + '.' + plugName);
      } catch (e) {
        notInstalledCb();
        return;
      }
      installedCb();
    }
  };

  AdapterJS.WebRTCPlugin.defineWebRTCInterface = function () {
    AdapterJS.WebRTCPlugin.pluginState = AdapterJS.WebRTCPlugin.PLUGIN_STATES.INITIALIZING;

    AdapterJS.isDefined = function (variable) {
      return variable !== null && variable !== undefined;
    };

    window.createIceServer = function (url, username, password) {
      var iceServer = null;
      var url_parts = url.split(':');
      if (url_parts[0].indexOf('stun') === 0) {
        iceServer = {
          'url' : url,
          'hasCredentials' : false
        };
      } else if (url_parts[0].indexOf('turn') === 0) {
        iceServer = {
          'url' : url,
          'hasCredentials' : true,
          'credential' : password,
          'username' : username
        };
      }
      return iceServer;
    };

    window.createIceServers = function (urls, username, password) {
      var iceServers = [];
      for (var i = 0; i < urls.length; ++i) {
        iceServers.push(createIceServer(urls[i], username, password));
      }
      return iceServers;
    };

    window.RTCSessionDescription = function (info) {
      AdapterJS.WebRTCPlugin.WaitForPluginReady();
      return AdapterJS.WebRTCPlugin.plugin.
        ConstructSessionDescription(info.type, info.sdp);
    };

    RTCPeerConnection = function (servers, constraints) {
      var iceServers = null;
      if (servers) {
        iceServers = servers.iceServers;
        for (var i = 0; i < iceServers.length; i++) {
          if (iceServers[i].urls && !iceServers[i].url) {
            iceServers[i].url = iceServers[i].urls;
          }
          iceServers[i].hasCredentials = AdapterJS.
            isDefined(iceServers[i].username) &&
            AdapterJS.isDefined(iceServers[i].credential);
        }
      }
      var mandatory = (constraints && constraints.mandatory) ?
        constraints.mandatory : null;
      var optional = (constraints && constraints.optional) ?
        constraints.optional : null;

      AdapterJS.WebRTCPlugin.WaitForPluginReady();
      return AdapterJS.WebRTCPlugin.plugin.
        PeerConnection(AdapterJS.WebRTCPlugin.pageId,
        iceServers, mandatory, optional);
    };

    window.MediaStreamTrack = {};
    MediaStreamTrack.getSources = function (callback) {
      AdapterJS.WebRTCPlugin.callWhenPluginReady(function() {
        AdapterJS.WebRTCPlugin.plugin.GetSources(callback);
      });
    };

    getUserMedia = function (constraints, successCallback, failureCallback) {
      if (!constraints.audio) {
        constraints.audio = false;
      }

      AdapterJS.WebRTCPlugin.callWhenPluginReady(function() {
        AdapterJS.WebRTCPlugin.plugin.
          getUserMedia(constraints, successCallback, failureCallback);
      });
    };
    navigator.getUserMedia = getUserMedia;

    attachMediaStream = function (element, stream) {
      stream.enableSoundTracks(true);
      if (element.nodeName.toLowerCase() !== 'audio') {
        var elementId = element.id.length === 0 ? Math.random().toString(36).slice(2) : element.id;
        if (!element.isWebRTCPlugin || !element.isWebRTCPlugin()) {
          var frag = document.createDocumentFragment();
          var temp = document.createElement('div');
          var classHTML = (element.className) ? 'class="' + element.className + '" ' : '';
          temp.innerHTML = '<object id="' + elementId + '" ' + classHTML +
            'type="' + AdapterJS.WebRTCPlugin.pluginInfo.type + '">' +
            '<param name="pluginId" value="' + elementId + '" /> ' +
            '<param name="pageId" value="' + AdapterJS.WebRTCPlugin.pageId + '" /> ' +
            '<param name="windowless" value="true" /> ' +
            '<param name="streamId" value="' + stream.id + '" /> ' +
            '</object>';
          while (temp.firstChild) {
            frag.appendChild(temp.firstChild);
          }
          var rectObject = element.getBoundingClientRect();
          element.parentNode.insertBefore(frag, element);
          frag = document.getElementById(elementId);
          frag.width = rectObject.width + 'px';
          frag.height = rectObject.height + 'px';
          element.parentNode.removeChild(element);
        } else {
          var children = element.children;
          for (var i = 0; i !== children.length; ++i) {
            if (children[i].name === 'streamId') {
              children[i].value = stream.id;
              break;
            }
          }
          element.setStreamId(stream.id);
        }
        var newElement = document.getElementById(elementId);
        newElement.onplaying = (element.onplaying) ? element.onplaying : function (arg) {};
        if (isIE) { // on IE the event needs to be plugged manually
          newElement.attachEvent('onplaying', newElement.onplaying);
          newElement.onclick = (element.onclick) ? element.onclick : function (arg) {};
          newElement._TemOnClick = function (id) {
            var arg = {
              srcElement : document.getElementById(id)
            };
            newElement.onclick(arg);
          };
        }
        return newElement;
      } else {
        return element;
      }
    };

    reattachMediaStream = function (to, from) {
      var stream = null;
      var children = from.children;
      for (var i = 0; i !== children.length; ++i) {
        if (children[i].name === 'streamId') {
          AdapterJS.WebRTCPlugin.WaitForPluginReady();
          stream = AdapterJS.WebRTCPlugin.plugin
            .getStreamWithId(AdapterJS.WebRTCPlugin.pageId, children[i].value);
          break;
        }
      }
      if (stream !== null) {
        return attachMediaStream(to, stream);
      } else {
        console.log('Could not find the stream associated with this element');
      }
    };

    window.RTCIceCandidate = function (candidate) {
      if (!candidate.sdpMid) {
        candidate.sdpMid = '';
      }

      AdapterJS.WebRTCPlugin.WaitForPluginReady();
      return AdapterJS.WebRTCPlugin.plugin.ConstructIceCandidate(
        candidate.sdpMid, candidate.sdpMLineIndex, candidate.candidate
      );
    };

    // inject plugin
    AdapterJS.addEvent(document, 'readystatechange', AdapterJS.WebRTCPlugin.injectPlugin);
    AdapterJS.WebRTCPlugin.injectPlugin();
  };

  AdapterJS.WebRTCPlugin.pluginNeededButNotInstalledCb = AdapterJS.WebRTCPlugin.pluginNeededButNotInstalledCb ||
    function() {
      AdapterJS.addEvent(document,
                        'readystatechange',
                         AdapterJS.WebRTCPlugin.pluginNeededButNotInstalledCbPriv);
      AdapterJS.WebRTCPlugin.pluginNeededButNotInstalledCbPriv();
    };

  AdapterJS.WebRTCPlugin.pluginNeededButNotInstalledCbPriv = function () {
    if (AdapterJS.options.hidePluginInstallPrompt) {
      return;
    }

    var downloadLink = AdapterJS.WebRTCPlugin.pluginInfo.downloadLink;
    if(downloadLink) { // if download link
      var popupString;
      if (AdapterJS.WebRTCPlugin.pluginInfo.portalLink) { // is portal link
       popupString = 'This website requires you to install the ' +
        ' <a href="' + AdapterJS.WebRTCPlugin.pluginInfo.portalLink +
        '" target="_blank">' + AdapterJS.WebRTCPlugin.pluginInfo.companyName +
        ' WebRTC Plugin</a>' +
        ' to work on this browser.';
      } else { // no portal link, just print a generic explanation
       popupString = 'This website requires you to install a WebRTC-enabling plugin ' +
        'to work on this browser.';
      }

      AdapterJS.WebRTCPlugin.renderNotificationBar(popupString, 'Install Now', downloadLink);
    } else { // no download link, just print a generic explanation
      AdapterJS.WebRTCPlugin.renderNotificationBar('Your browser does not support WebRTC.');
    }
  };

  AdapterJS.WebRTCPlugin.renderNotificationBar = function (text, buttonText, buttonLink) {
    // only inject once the page is ready
    if (document.readyState !== 'complete') {
      return;
    }

    var w = window;
    var i = document.createElement('iframe');
    i.style.position = 'fixed';
    i.style.top = '-41px';
    i.style.left = 0;
    i.style.right = 0;
    i.style.width = '100%';
    i.style.height = '40px';
    i.style.backgroundColor = '#ffffe1';
    i.style.border = 'none';
    i.style.borderBottom = '1px solid #888888';
    i.style.zIndex = '9999999';
    if(typeof i.style.webkitTransition === 'string') {
      i.style.webkitTransition = 'all .5s ease-out';
    } else if(typeof i.style.transition === 'string') {
      i.style.transition = 'all .5s ease-out';
    }
    document.body.appendChild(i);
    c = (i.contentWindow) ? i.contentWindow :
      (i.contentDocument.document) ? i.contentDocument.document : i.contentDocument;
    c.document.open();
    c.document.write('<span style="font-family: Helvetica, Arial,' +
      'sans-serif; font-size: .9rem; padding: 7px; vertical-align: ' +
      'middle; cursor: default;">' + text + '</span>');
    if(buttonText && buttonLink) {
      c.document.write('<button id="okay">' + buttonText + '</button><button>Cancel</button>');
      c.document.close();
      AdapterJS.addEvent(c.document.getElementById('okay'), 'click', function(e) {
        window.open(buttonLink, '_top');
        e.preventDefault();
        try {
          event.cancelBubble = true;
        } catch(error) { }
      });
    }
    else {
      c.document.close();
    }
    AdapterJS.addEvent(c.document, 'click', function() {
      w.document.body.removeChild(i);
    });
    setTimeout(function() {
      if(typeof i.style.webkitTransform === 'string') {
        i.style.webkitTransform = 'translateY(40px)';
      } else if(typeof i.style.transform === 'string') {
        i.style.transform = 'translateY(40px)';
      } else {
        i.style.top = '0px';
      }
    }, 300);
  };
  // Try to detect the plugin and act accordingly
  AdapterJS.WebRTCPlugin.isPluginInstalled(
    AdapterJS.WebRTCPlugin.pluginInfo.prefix,
    AdapterJS.WebRTCPlugin.pluginInfo.plugName,
    AdapterJS.WebRTCPlugin.defineWebRTCInterface,
    AdapterJS.WebRTCPlugin.pluginNeededButNotInstalledCb);
}
// Polyfill all MediaStream objects
var polyfillMediaStream = null;

// Firefox MediaStream
if (navigator.mozGetUserMedia) {

	/**
	 * The polyfilled MediaStream class.
	 * @class MediaStream
	 * @since 0.10.5
	 */
	polyfillMediaStream = function (stream) {

		/**
		 * The MediaStream object id.
		 * @attribute id
		 * @type String
		 * @readOnly
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream.id = stream.id || (new Date()).getTime().toString();

		/**
		 * The flag that indicates if a MediaStream object has ended.
		 * @attribute ended
		 * @type Boolean
		 * @readOnly
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream.ended = typeof stream.ended === 'boolean' ? stream.ended : false;

		/**
		 * Event triggered when MediaStream has ended streaming.
		 * @event onended
		 * @param {String} type The type of event: <code>"ended"</code>.
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream.onended = null;

		/**
		 * Event triggered when MediaStream has added a new track.
		 * @event onaddtrack
		 * @param {String} type The type of event: <code>"addtrack"</code>.
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream.onaddtrack = null;

		/**
		 * Event triggered when MediaStream has removed an existing track.
		 * @event onremovetrack
		 * @param {String} type The type of event: <code>"removetrack"</code>.
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream.onremovetrack = null;


		var polyEndedEmitter = function () {
			// set the ended as true
			stream.ended = true;

			// trigger that it has ended
      if (typeof stream.onended === 'function') {
        stream.onended({
        	type: 'ended',
			  	bubbles: false,
			  	cancelBubble: false,
			  	cancelable: false,
			  	currentTarget: stream,
			  	defaultPrevented: false,
			  	eventPhase: 0,
			  	returnValue: true,
			  	srcElement: stream,
			  	target: stream,
			  	timeStamp: stream.currentTime || (new Date()).getTime()
			  });
      }
		};


		(function () {
			var i, j;

			var audioTracks = stream.getAudioTracks();
	    var videoTracks = stream.getVideoTracks();

	    // Check for all tracks if ended
	    for (i = 0; i < audioTracks.length; i += 1) {
	      polyfillMediaStreamTrack( audioTracks[i] );
	    }

	    for (j = 0; j < videoTracks.length; j += 1) {
	      polyfillMediaStreamTrack( videoTracks[j] );
	    }
		})();

		/**
		 * Stops a MediaStream streaming.
		 * @method polystop
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream.polystop = function () {
			if (stream instanceof LocalMediaStream) {
				stream.stop();

			} else {
				var i, j;

				var audioTracks = stream.getAudioTracks();
				var videoTracks = stream.getVideoTracks();

				for (i = 0; i < audioTracks.length; i += 1) {
					audioTracks[i].polystop();
				}

				for (j = 0; j < videoTracks.length; j += 1) {
					videoTracks[j].polystop();
				}
			}
		};

		/**
		 * Adds a MediaStreamTrack to an object.
		 * @method polyaddTrack
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream.polyaddTrack = function (track) {
			try {
				stream.addTrack(track);
			} catch (error) {
				throw error;
			}
		};

		/**
		 * Gets a MediaStreamTrack from a MediaStreamTrack based on the object id provided.
		 * @method polygetTrackById
		 * @param {String} trackId The MediaStreamTrack object id.
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream.polygetTrackById = function (trackId) {
			var i, j;

			var audioTracks = stream.getAudioTracks();
	    var videoTracks = stream.getVideoTracks();

	    // Check for all tracks if ended
	    for (i = 0; i < audioTracks.length; i += 1) {
	      if (audioTracks[i].id === trackId) {
	      	return audioTracks[i];
	      }
	    }

	    for (j = 0; j < videoTracks.length; j += 1) {
	      if (videoTracks[i].id === trackId) {
	      	return videoTracks[i];
	      }
	    }

	    return null;
		};

		/**
		 * Removes a MediaStreamTrack from an object.
		 * @method polyremoveTrack
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream.polyremoveTrack = function (track) {
			try {
				stream.removeTrack(track);
			} catch (error) {
				throw error;
			}
		};

		/**
		 * Gets the list of audio MediaStreamTracks of a MediaStream.
		 * @method polygetAudioTracks
		 * @return {Array} Returns a list of the audio MediaStreamTracks
		 *   available for the MediaStream.
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream.polygetAudioTracks = stream.getAudioTracks;

		/**
		 * Gets the list of video MediaStreamTracks of a MediaStream.
		 * @method polygetVideoTracks
		 * @return {Array} Returns a list of the video MediaStreamTracks
		 *   available for the MediaStream.
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream.polygetVideoTracks = stream.getVideoTracks;

		/**
		 * Listens and waits to check if all MediaStreamTracks of a MediaStream
		 *   has ended. Once ended, this invokes the ended flag of the MediaStream.
		 * This loops every second.
		 * @method _polyOnTracksEndedListener
		 * @private
		 * @optional
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream._polyOnTracksEndedListener = setInterval(function () {
	    var i, j;

	    var audioTracks = stream.getAudioTracks();
	    var videoTracks = stream.getVideoTracks();

	    var audioEnded = true;
	    var videoEnded = true;

	    // Check for all tracks if ended
	    for (i = 0; i < audioTracks.length; i += 1) {
	      if (audioTracks[i].ended !== true) {
	        audioEnded = false;
	        break;
	      }
	    }

	    for (j = 0; j < videoTracks.length; j += 1) {
	      if (videoTracks[j].ended !== true) {
	        videoEnded = false;
	        break;
	      }
	    }

	    if (audioEnded && videoEnded) {
	      clearInterval(stream._polyOnTracksEndedListener);
	      stream.ended = true;
	    }
	  }, 1000);

	  /**
		 * Listens and waits to check if all MediaStream has ended.
		 * This loops every second.
		 * @method _polyOnEndedListener
		 * @private
		 * @optional
		 * @for MediaStream
		 * @since 0.10.6
		 */
		if (stream instanceof LocalMediaStream) {
			stream._polyOnEndedListener = setInterval(function () {
				// If stream has flag ended because of media tracks being stopped
        if (stream.ended) {
          clearInterval(stream._polyOnEndedListener);

          polyEndedEmitter();

          return;
        }

        if (typeof stream.recordedTime === 'undefined') {
          stream.recordedTime = 0;
        }

        if (stream.recordedTime === stream.currentTime) {
          clearInterval(stream._polyOnEndedListener);

          polyEndedEmitter();

          return;

        } else {
          stream.recordedTime = stream.currentTime;
        }
			}, 1000);

		} else {
			/**
			 * Stores the attached video element with the existing MediaStream
			 * This loops every second.
			 * - This only exists in Firefox browsers.
			 * @attribute _polyOnEndedListenerObj
			 * @type DOM
			 * @private
			 * @optional
			 * @for MediaStream
			 * @since 0.10.6
			 */
			// Use a video to attach to check if stream has ended
	    var video = document.createElement('video');

			video._polyOnEndedListener = setInterval(function () {
	      // If stream has flag ended because of media tracks being stopped
	      if (stream.ended) {
	        clearInterval(video._polyOnEndedListener);

	        polyEndedEmitter();

	        return;
	      }

	      // Check if mozSrcObject is not empty
	      if (typeof video.mozSrcObject === 'object' &&
	          video.mozSrcObject !== null) {

	        if (video.mozSrcObject.ended === true) {
	          clearInterval(video._polyOnEndedListener);

	          polyEndedEmitter();

	          return;
	        }
	      }
	    }, 1000);

	    // Bind the video element to MediaStream object
	    stream._polyOnEndedListenerObj = video;

	    window.attachMediaStream(video, stream);
		}
	};

	window.getUserMedia = function (constraints, successCb, failureCb) {

		navigator.mozGetUserMedia(constraints, function (stream) {
			polyfillMediaStream(stream);

			successCb(stream);

		}, failureCb);
	};

	window.attachMediaStream = function (element, stream) {
    // If there's an element used for checking stream stop
    // for an instance remote MediaStream for firefox
    // reattachmediastream instead
    if (typeof stream._polyOnEndedListenerObj !== 'undefined' &&
      stream instanceof LocalMediaStream === false) {
      window.reattachMediaStream(element, bind._polyOnEndedListenerObj);

    // LocalMediaStream
    } else {
      console.log('Attaching media stream');
    	element.mozSrcObject = stream;
    }
  };

// Chrome / Opera MediaStream
} else if (navigator.webkitGetUserMedia) {

	polyfillMediaStream = function (stream) {

		stream.id = stream.id || (new Date()).getTime().toString();

		stream.ended = typeof stream.ended === 'boolean' ? stream.ended : false;

		stream.onended = null;

		stream.onaddtrack = null;

		stream.onremovetrack = null;


		(function () {
			var i, j;

			var audioTracks = stream.getAudioTracks();
	    var videoTracks = stream.getVideoTracks();

	    // Check for all tracks if ended
	    for (i = 0; i < audioTracks.length; i += 1) {
	      polyfillMediaStreamTrack( audioTracks[i] );
	    }

	    for (j = 0; j < videoTracks.length; j += 1) {
	      polyfillMediaStreamTrack( videoTracks[j] );
	    }
		})();

		stream.polystop = stream.stop;

		stream.polyaddTrack = function (track) {
			try {
				stream.addTrack(track);
			} catch (error) {
				throw error;
			}
		};

		stream.polygetTrackById = stream.getTrackById;

		stream.polyremoveTrack = function (track) {
			try {
				stream.removeTrack(track);
			} catch (error) {
				throw error;
			}
		};

		stream.polygetAudioTracks = stream.getAudioTracks;

		stream.polygetVideoTracks = stream.getVideoTracks;
	};

	window.getUserMedia = function (constraints, successCb, failureCb) {
		navigator.webkitGetUserMedia(constraints, function (stream) {

			polyfillMediaStream(stream);

			successCb(stream);
		}, failureCb);

	};

// Safari MediaStream
} else {

	polyfillMediaStream = function (stream) {

		stream.id = stream.id || (new Date()).getTime().toString();

		stream.ended = typeof stream.ended === 'boolean' ? stream.ended : false;

		stream.onended = null;

		stream.onaddtrack = null;

		stream.onremovetrack = null;

		// MediaStreamTracks Polyfilled
		var polyStoreMediaTracks = {
			audio: [],
			video: []
		};

		var polyTrackEndedEmitter = function (track) {
			// set the ended as true
			track.ended = true;

			// trigger that it has ended
      if (typeof track.onended === 'function') {
        track.onended({
        	type: 'ended',
			  	bubbles: false,
			  	cancelBubble: false,
			  	cancelable: false,
			  	currentTarget: track,
			  	defaultPrevented: false,
			  	eventPhase: 0,
			  	returnValue: true,
			  	srcElement: track,
			  	target: track,
			  	timeStamp: (new Date()).getTime()
			  });
      }
		};


		(function () {
			var i, j;

			var audioTracks = stream.getAudioTracks();
	    var videoTracks = stream.getVideoTracks();

	    var outputAudioTracks = [];
	    var outputVideoTracks = [];

	    // Check for all tracks if ended
	    for (i = 0; i < audioTracks.length; i += 1) {
	      var audioTrack = polyfillMediaStreamTrack( audioTracks[i] );
	      outputAudioTracks.push(audioTrack);
	    }

	    for (j = 0; j < videoTracks.length; j += 1) {
	      var videoTrack = polyfillMediaStreamTrack( videoTracks[j] );
	      outputVideoTracks.push(videoTrack);
	    }

	    polyStoreMediaTracks.audio = outputAudioTracks;
	    polyStoreMediaTracks.video = outputVideoTracks;
		})();

		stream.polystop = function () {
			stream.stop();

			var i, j;

			var outputAudioTracks = polyStoreMediaTracks.audio;
			var outputVideoTracks = polyStoreMediaTracks.video;

	    // Check for all tracks if ended
	    for (i = 0; i < outputAudioTracks.length; i += 1) {
	    	polyTrackEndedEmitter( outputAudioTracks[i] );
	    }

	    for (j = 0; j < outputVideoTracks.length; j += 1) {
	      polyTrackEndedEmitter( outputVideoTracks[j] );
	    }
		};

		stream.polyaddTrack = function (track) {
			try {
				stream.addTrack(track);
			} catch (error) {
				throw error;
			}
		};

		stream.polygetTrackById = function (trackId) {
			var i, j;

			var outputAudioTracks = polyStoreMediaTracks.audio;
			var outputVideoTracks = polyStoreMediaTracks.video;

	    // Check for all tracks if ended
	    for (i = 0; i < outputAudioTracks.length; i += 1) {
	    	if (outputAudioTracks[i].id === trackId) {
	      	return outputAudioTracks[i];
	      }
	    }

	    for (j = 0; j < outputVideoTracks.length; j += 1) {
	      if (outputVideoTracks[j].id === trackId) {
	      	return outputVideoTracks[j];
	      }
	    }

	    return null;
		};

		stream.polyremoveTrack = function (track) {
			try {
				stream.removeTrack(track);
			} catch (error) {
				throw error;
			}
		};

		stream.polygetAudioTracks = function () {
			return polyStoreMediaTracks.audio;
		};

		stream.polygetVideoTracks = function () {
			return polyStoreMediaTracks.video;
		};
	};

	window.getUserMedia = function (constraints, successCb, failureCb) {
		navigator.getUserMedia(constraints, function(stream) {

      polyfillMediaStream(stream);

     	successCb(stream);
    }, failureCb);
  };
}
// Polyfill all MediaStream objects
var polyfillMediaStreamTrack = null;


if (navigator.mozGetUserMedia) {

  /**
   * The polyfilled MediaStreamTrack class.
   * @class MediaStreamTrack
   * @since 0.10.5
   */
	polyfillMediaStreamTrack = function (track) {

    /**
     * The MediaStreamTrack object id.
     * @attribute id
     * @type String
     * @readOnly
     * @for MediaStreamTrack
     * @since 0.10.6
     */
    //track.id = track.id || (new Date()).getTime().toString();

    /**
     * The MediaStreamTrack object label.
     * @attribute label
     * @type String
     * @readOnly
     * @for MediaStreamTrack
     * @since 0.10.6
     */
    //track.label = track.label || track.kind + '-' + track.id;

    /**
     * The flag that indicates if a MediaStreamTrack object has ended.
     * @attribute ended
     * @type Boolean
     * @readOnly
     * @for MediaStreamTrack
     * @since 0.10.6
     */
    track.ended = typeof track.ended === 'boolean' ? track.ended : false;

    /**
     * The flag that indicates if a MediaStreamTrack object is enabled.
     * - Set it to <code>true</code> for enabled track stream or set it to
     *   <code>false</code> for disable track stream.
     * @attribute enabled
     * @type Boolean
     * @for MediaStreamTrack
     * @since 0.10.6
     */
    track.enabled = true;

    /**
     * The flag that indicates if a MediaStreamTrack object is muted.
     * @attribute muted
     * @type Boolean
     * @readOnly
     * @for MediaStreamTrack
     * @since 0.10.6
     */
    track.muted = typeof track.muted === 'boolean' ? track.muted : false;

    /**
     * The ready state status of a MediaStreamTrack object.
     * @attribute readyState
     * @type String
     * @readOnly
     * @for MediaStreamTrack
     * @since 0.10.6
     */
    track.readyState = typeof track.readyState === 'string' ? track.readyState : 'live';

    /**
     * The MediaStreamTrack object type.
     * - <code>"audio"</code>: The MediaStreamTrack object type is an audio track.
     * - <code>"video"</code>: The MediaStreamTrack object type is an video track.
     * @attribute kind
     * @type String
     * @readOnly
     * @for MediaStreamTrack
     * @since 0.10.6
     */
    //track.kind = track.kind;

    /**
     * The status if a MediaStreamTrack object is read only and cannot to be overwritten.
     * @attribute readOnly
     * @type Boolean
     * @readOnly
     * @for MediaStreamTrack
     * @since 0.10.6
     */
    track.readOnly = typeof track.readOnly === 'boolean' ? track.readOnly : false;

    /**
     * Event triggered when MediaStreamTrack has ended streaming.
     * @event onended
     * @param {String} type The type of event: <code>"ended"</code>.
     * @for MediaStreamTrack
     * @since 0.10.6
     */
    track.onended = null;

    /**
     * Event triggered when MediaStreamTrack has started streaming.
     * @event onstarted
     * @param {String} type The type of event: <code>"started"</code>.
     * @for MediaStreamTrack
     * @since 0.10.6
     */
    track.onstarted = null;

    /**
     * Event triggered when MediaStreamTrack has been muted.
     * @event onmute
     * @param {String} type The type of event: <code>"mute"</code>.
     * @for MediaStreamTrack
     * @since 0.10.6
     */
    track.onmute = null;

    /**
     * Event triggered when MediaStreamTrack has been unmuted.
     * @event onunmute
     * @param {String} type The type of event: <code>"unmute"</code>.
     * @for MediaStreamTrack
     * @since 0.10.6
     */
    track.onunmute = null;

    /**
     * Event triggered when MediaStreamTrack is over constrained.
     * @event onoverconstrained
     * @param {String} type The type of event: <code>"overconstrained"</code>.
     * @for MediaStreamTrack
     * @since 0.10.6
     */
    track.onoverconstrained = null;


    var polyTrackEndedEmitter = function () {
      // set the ended as true
      track.ended = true;
      // set the readyState to 'ended'
      track.readyState = 'ended';

      // trigger that it has ended
      if (typeof track.onended === 'function') {
        track.onended({
          type: 'ended',
          bubbles: false,
          cancelBubble: false,
          cancelable: false,
          currentTarget: track,
          defaultPrevented: false,
          eventPhase: 0,
          returnValue: true,
          srcElement: track,
          target: track,
          timeStamp: (new Date()).getTime()
        });
      }
    };

    /**
     * Stops a MediaStreamTrack streaming.
     * @method polystop
     * @for MediaStreamTrack
     * @since 0.10.6
     */
    track.polystop = function () {
      track.stop();

      polyTrackEndedEmitter();
    };
  };


} else if (navigator.webkitGetUserMedia) {

  polyfillMediaStreamTrack = function (track) {

    //track.id = track.id || (new Date()).getTime().toString();

    track.label = track.label || track.kind + '-' + track.id;

    track.ended = false;

    track.enabled = true;

    track.muted = typeof track.muted === 'boolean' ? track.muted : false;

    track.readyState = typeof track.readyState === 'string' ? track.readyState : 'live';

    //track.kind = track.kind;

    track.readOnly = typeof track.readOnly === 'boolean' ? track.readOnly : false;

    track.onended = null;

    track.onstarted = null;

    track.onmute = null;

    track.onunmute = null;

    track.onoverconstrained = null;


    var polyTrackEndedEmitter = function () {
      // set the ended as true
      track.ended = true;
      // set the readyState to 'ended'
      track.readyState = 'ended';

      // trigger that it has ended
      if (typeof track.onended === 'function') {
        track.onended({
          type: 'ended',
          bubbles: false,
          cancelBubble: false,
          cancelable: false,
          currentTarget: track,
          defaultPrevented: false,
          eventPhase: 0,
          returnValue: true,
          srcElement: track,
          target: track,
          timeStamp: (new Date()).getTime()
        });
      }
    };

    track.polystop = function () {
      track.stop();

      polyTrackEndedEmitter();
    };
  };

} else {

  polyfillMediaStreamTrack = function (track) {

    track.id = track.id || (new Date()).getTime().toString();

    track.label = typeof track.label === 'undefined' ? track.kind + '-' + track.id : track.label;

    track.ended = false;

    track.enabled = true;

    track.muted = typeof track.muted === 'boolean' ? track.muted : false;

    track.readyState = typeof track.readyState === 'string' ? track.readyState : 'live';

    track.kind = track.kind;

    track.readOnly = typeof track.readOnly === 'boolean' ? track.readOnly : false;

    track.onended = null;

    track.onstarted = null;

    track.onmute = null;

    track.onunmute = null;

    track.onoverconstrained = null;


    var polyTrackEndedEmitter = function () {
      // set the ended as true
      track.ended = true;
      // set the readyState to 'ended'
      track.readyState = 'ended';

      // trigger that it has ended
      if (typeof track.onended === 'function') {
        track.onended({
          type: 'ended',
          bubbles: false,
          cancelBubble: false,
          cancelable: false,
          currentTarget: track,
          defaultPrevented: false,
          eventPhase: 0,
          returnValue: true,
          srcElement: track,
          target: track,
          timeStamp: (new Date()).getTime()
        });
      }
    };

    track.polystop = function () {
      try {
        track.stop();

        polyTrackEndedEmitter();

      } catch (error) {
        throw error;
      }
    };

    return track;
  };
}
// Polyfill all MediaStream objects
var polyfillRTCPeerConnection = null;

// Return the event payload
var returnEventPayloadFn = function (stream) {
	return {
  	bubbles: false,
  	cancelBubble: false,
  	cancelable: false,
  	currentTarget: stream,
  	defaultPrevented: false,
  	eventPhase: 0,
  	returnValue: true,
  	srcElement: stream,
  	target: stream,
  	timeStamp: stream.currentTime || (new Date()).getTime()
  };
};

// MediaStreamTracks Polyfilled
var storePolyfillMediaStreamTracks = {};

// Firefox MediaStream
if (navigator.mozGetUserMedia) {

	/**
	 * The polyfilled RTCPeerConnection class.
	 * @class RTCPeerConnection
	 * @since 0.10.5
	 */
	polyfillRTCPeerConnection = function (stream) {

		/**
		 * The MediaStream object id.
		 * @attribute id
		 * @type String
		 * @readOnly
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream.id = stream.id || (new Date()).getTime().toString();

		/**
		 * The flag that indicates if a MediaStream object has ended.
		 * @attribute ended
		 * @type Boolean
		 * @readOnly
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream.ended = false;

		/**
		 * Event triggered when MediaStream has ended streaming.
		 * @event onended
		 * @param {String} type The type of event: <code>"ended"</code>.
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream.onended = null;

		/**
		 * Event triggered when MediaStream has added a new track.
		 * @event onaddtrack
		 * @param {String} type The type of event: <code>"addtrack"</code>.
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream.onaddtrack = null;

		/**
		 * Event triggered when MediaStream has removed an existing track.
		 * @event onremovetrack
		 * @param {String} type The type of event: <code>"removetrack"</code>.
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream.onremovetrack = null;

		/**
		 * Event triggered when a feature in the MediaStream is not supported
		 *   but used.
		 * @event onunsupported
		 * @param {String} feature The feature that is not supported. <i>Eg. <code>"addTrack"</code></i>.
		 * @param {Object} error The error received natively.
		 * @param {String} type The type of event: <code>"unsupported"</code>.
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream.onunsupported = null;


		(function () {
			var i, j;

			var audioTracks = stream.getAudioTracks();
	    var videoTracks = stream.getVideoTracks();

	    // Check for all tracks if ended
	    for (i = 0; i < audioTracks.length; i += 1) {
	      polyfillMediaStreamTrack( audioTracks[i] );
	    }

	    for (j = 0; j < videoTracks.length; j += 1) {
	      polyfillMediaStreamTrack( videoTracks[j] );
	    }
		})();

		/**
		 * Stops a MediaStream streaming.
		 * @method polystop
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream.polystop = function () {
			if (stream instanceof LocalMediaStream) {
				stream.stop();

			} else {
				var i, j;

				var audioTracks = stream.getAudioTracks();
				var videoTracks = stream.getVideoTracks();

				for (i = 0; i < audioTracks.length; i += 1) {
					audioTracks[i].polystop();
				}

				for (j = 0; j < videoTracks.length; j += 1) {
					videoTracks[j].polystop();
				}
			}
		};

		/**
		 * Adds a MediaStreamTrack to an object.
		 * @method polyaddTrack
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream.polyaddTrack = function (track) {
			try {
				stream.addTrack(track);
			} catch (error) {
				// trigger that it has ended
        if (typeof stream.onunsupported === 'function') {
          var eventPayload = returnEventPayloadFn(stream);
          eventPayload.type = 'unsupported';
          eventPayload.error = error;
          eventPayload.feature = 'addTrack';
          stream.onunsupported(eventPayload);
        }
			}
		};

		/**
		 * Gets a MediaStreamTrack from a MediaStreamTrack based on the object id provided.
		 * @method polygetTrackById
		 * @param {String} trackId The MediaStreamTrack object id.
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream.polygetTrackById = function (trackId) {
			var i, j;

			var audioTracks = stream.getAudioTracks();
	    var videoTracks = stream.getVideoTracks();

	    // Check for all tracks if ended
	    for (i = 0; i < audioTracks.length; i += 1) {
	      if (audioTracks[i].id === trackId) {
	      	return audioTracks[i];
	      }
	    }

	    for (j = 0; j < videoTracks.length; j += 1) {
	      if (videoTracks[i].id === trackId) {
	      	return videoTracks[i];
	      }
	    }

	    return null;
		};

		/**
		 * Removes a MediaStreamTrack from an object.
		 * @method polyremoveTrack
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream.polyremoveTrack = function (track) {
			try {
				stream.removeTrack(track);
			} catch (error) {
				// trigger that it has ended
        if (typeof stream.onunsupported === 'function') {
          var eventPayload = returnEventPayloadFn(stream);
          eventPayload.type = 'unsupported';
          eventPayload.error = error;
          eventPayload.feature = 'removeTrack';
          stream.onunsupported(eventPayload);
        }
			}
		};

		/**
		 * Gets the list of audio MediaStreamTracks of a MediaStream.
		 * @method polygetAudioTracks
		 * @return {Array} Returns a list of the audio MediaStreamTracks
		 *   available for the MediaStream.
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream.polygetAudioTracks = stream.getAudioTracks;

		/**
		 * Gets the list of video MediaStreamTracks of a MediaStream.
		 * @method polygetVideoTracks
		 * @return {Array} Returns a list of the video MediaStreamTracks
		 *   available for the MediaStream.
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream.polygetVideoTracks = stream.getVideoTracks;

		/**
		 * Listens and waits to check if all MediaStreamTracks of a MediaStream
		 *   has ended. Once ended, this invokes the ended flag of the MediaStream.
		 * This loops every second.
		 * @method _polyOnTracksEndedListener
		 * @private
		 * @optional
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream._polyOnTracksEndedListener = setInterval(function () {
	    var i, j;

	    var audios = stream.getAudioTracks();
	    var videos = stream.getVideoTracks();

	    var audioEnded = true;
	    var videoEnded = true;

	    // Check for all tracks if ended
	    for (i = 0; i < audios.length; i += 1) {
	      if (audios[i].ended !== true) {
	        audioEnded = false;
	        break;
	      }
	    }

	    for (j = 0; j < videos.length; j += 1) {
	      if (videos[j].ended !== true) {
	        videoEnded = false;
	        break;
	      }
	    }

	    if (audioEnded && videoEnded) {
	      clearInterval(stream._polyOnTracksEndedListener);
	      stream.ended = true;
	    }
	  }, 1000);

	  /**
		 * Listens and waits to check if all MediaStream has ended.
		 * This loops every second.
		 * @method _polyOnEndedListener
		 * @private
		 * @optional
		 * @for MediaStream
		 * @since 0.10.6
		 */
		if (stream instanceof LocalMediaStream) {
			stream._polyOnEndedListener = setInterval(function () {
				// If stream has flag ended because of media tracks being stopped
        if (stream.ended) {
          clearInterval(stream._polyOnEndedListener);

          // trigger that it has ended
          if (typeof stream.onended === 'function') {
            var eventPayload = returnEventPayloadFn(stream);
            eventPayload.type = 'ended';
            stream.onended(eventPayload);
          }
        }

        if (typeof stream.recordedTime === 'undefined') {
          stream.recordedTime = 0;
        }

        if (stream.recordedTime === stream.currentTime) {
          clearInterval(stream._polyOnEndedListener);

          stream.ended = true;

          // trigger that it has ended
          if (typeof stream.onended === 'function') {
            var eventPayload = returnEventPayloadFn(stream);
            eventPayload.type = 'ended';
            stream.onended(eventPayload);
          }

        } else {
          stream.recordedTime = stream.currentTime;
        }
			}, 1000);

		} else {
			/**
			 * Stores the attached video element with the existing MediaStream
			 * This loops every second.
			 * - This only exists in Firefox browsers.
			 * @attribute _polyOnEndedListenerObj
			 * @type DOM
			 * @private
			 * @optional
			 * @for MediaStream
			 * @since 0.10.6
			 */
			// Use a video to attach to check if stream has ended
	    var video = document.createElement('video');

			video._polyOnEndedListener = setInterval(function () {
	      // If stream has flag ended because of media tracks being stopped
	      if (stream.ended) {
	        clearInterval(video._polyOnEndedListener);

	        // trigger that it has ended
	        if (typeof stream.onended === 'function') {
	        	var eventPayload = returnEventPayloadFn(stream);
	        	eventPayload.type = 'ended';
	          stream.onended(eventPayload);
	        }
	      }

	      // Check if mozSrcObject is not empty
	      if (typeof video.mozSrcObject === 'object' &&
	          video.mozSrcObject !== null) {

	        if (video.mozSrcObject.ended === true) {
	          clearInterval(video._polyOnEndedListener);

	          stream.ended = true;

	          // trigger that it has ended
	          if (typeof stream.onended === 'function') {
	            var eventPayload = returnEventPayloadFn(stream);
		        	eventPayload.type = 'ended';
		          stream.onended(eventPayload);
	          }
	        }
	      }
	    }, 1000);

	    // Bind the video element to MediaStream object
	    stream._polyOnEndedListenerObj = video;

	    window.attachMediaStream(video, stream);
		}
	};

	window.getUserMedia = function (constraints, successCb, failureCb) {

		navigator.mozGetUserMedia(constraints, function (stream) {
			polyfillMediaStream(stream);

			successCb(stream);

		}, failureCb);
	};

	window.attachMediaStream = function (element, stream) {
    // If there's an element used for checking stream stop
    // for an instance remote MediaStream for firefox
    // reattachmediastream instead
    if (typeof stream._polyOnEndedListenerObj !== 'undefined' &&
      stream instanceof LocalMediaStream === false) {
      window.reattachMediaStream(element, bind._polyOnEndedListenerObj);

    // LocalMediaStream
    } else {
      console.log('Attaching media stream');
    	element.mozSrcObject = stream;
    }
  };

// Chrome / Opera MediaStream
} else if (navigator.webkitGetUserMedia) {

	polyfillMediaStream = function (stream) {

		stream.onended = null;

		stream.onaddtrack = null;

		stream.onremovetrack = null;

		stream.onunsupported = null;


		(function () {
			var i, j;

			var audioTracks = stream.getAudioTracks();
	    var videoTracks = stream.getVideoTracks();

	    // Check for all tracks if ended
	    for (i = 0; i < audioTracks.length; i += 1) {
	      polyfillMediaStreamTrack( audioTracks[i] );
	    }

	    for (j = 0; j < videoTracks.length; j += 1) {
	      polyfillMediaStreamTrack( videoTracks[j] );
	    }
		})();

		stream.polystop = function () {
			stream.stop();
		};

		stream.polyaddTrack = function (track) {
			try {
				stream.addTrack(track);
			} catch (error) {
				// trigger that it has ended
        if (typeof stream.onunsupported === 'function') {
          var eventPayload = returnEventPayloadFn(stream);
          eventPayload.type = 'unsupported';
          eventPayload.error = error;
          eventPayload.feature = 'addTrack';
          stream.onunsupported(eventPayload);
        }
			}
		};

		stream.polygetTrackById = stream.getTrackById;

		stream.polyremoveTrack = function (track) {
			try {
				stream.removeTrack(track);
			} catch (error) {
				// trigger that it has ended
        if (typeof stream.onunsupported === 'function') {
          var eventPayload = returnEventPayloadFn(stream);
          eventPayload.type = 'unsupported';
          eventPayload.error = error;
          eventPayload.feature = 'removeTrack';
          stream.onunsupported(eventPayload);
        }
			}
		};

		stream.polygetAudioTracks = stream.getAudioTracks;

		stream.polygetVideoTracks = stream.getVideoTracks;
	};

	window.getUserMedia = function (constraints, successCb, failureCb) {
		navigator.webkitGetUserMedia(constraints, function (stream) {

			polyfillMediaStream(stream);

			successCb(stream);
		}, failureCb);

	};

// Safari MediaStream
} else {

	polyfillMediaStream = function (stream) {

		/**
		 * Stores the store Id to store MediaStreamTrack functions.
		 * - This only exists in Safari / IE (Plugin-enabled) browsers.
		 * @attribute _polyStoreId
		 * @type String
		 * @optional
		 * @private
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream._polyStoreId = (new Date()).getTime().toString();

		stream.ended = typeof stream.ended === 'boolean' ? stream.ended : false;

		stream.onended = null;

		stream.onaddtrack = null;

		stream.onremovetrack = null;

		stream.onunsupported = null;

		(function () {
			var i, j;

			var audioTracks = stream.getAudioTracks();
	    var videoTracks = stream.getVideoTracks();

	    var outputAudioTracks = [];
	    var outputVideoTracks = [];

	    // Check for all tracks if ended
	    for (i = 0; i < audioTracks.length; i += 1) {
	      var track = polyfillMediaStreamTrack( audioTracks[i] );
	      outputAudioTracks.push(track);
	    }

	    for (j = 0; j < videoTracks.length; j += 1) {
	      var track = polyfillMediaStreamTrack( videoTracks[j] );
	      outputVideoTracks.push(track);
	    }

	    storePolyfillMediaStreamTracks[stream._polyStoreId] = {
	    	audio: outputAudioTracks,
	    	video: outputVideoTracks
	    };
		})();

		stream.polystop = function () {
			stream.stop();

			var i, j;

			var outputAudioTracks = storePolyfillMediaStreamTracks[stream._polyStoreId].audio;
			var outputVideoTracks = storePolyfillMediaStreamTracks[stream._polyStoreId].video;

	    // Check for all tracks if ended
	    for (i = 0; i < outputAudioTracks.length; i += 1) {
	    	var track = outputAudioTracks[i];
	      track.ended = true;

	      if (typeof track.onended === 'function') {
	      	var eventPayload = returnEventPayloadFn(track);
          eventPayload.type = 'ended';

          if (typeof track.onended === 'function') {
          	track.onended(eventPayload);
          }
	      }
	    }

	    for (j = 0; j < outputVideoTracks.length; j += 1) {
	      var track = outputVideoTracks[j];
	      track.ended = true;

	      if (typeof track.onended === 'function') {
	      	var eventPayload = returnEventPayloadFn(track);
          eventPayload.type = 'ended';

          if (typeof track.onended === 'function') {
          	track.onended(eventPayload);
          }
	      }
	    }
		};

		stream.polyaddTrack = function (track) {
			try {
				stream.addTrack(track);
			} catch (error) {
				// trigger that it has ended
        if (typeof stream.onunsupported === 'function') {
          var eventPayload = returnEventPayloadFn(stream);
          eventPayload.type = 'unsupported';
          eventPayload.error = error;
          eventPayload.feature = 'addTrack';
          stream.onunsupported(eventPayload);
        }
			}
		};

		stream.polygetTrackById = function (trackId) {
			var i, j;

			var outputAudioTracks = storePolyfillMediaStreamTracks[stream._polyStoreId].audio;
			var outputVideoTracks = storePolyfillMediaStreamTracks[stream._polyStoreId].video;

	    // Check for all tracks if ended
	    for (i = 0; i < outputAudioTracks.length; i += 1) {
	    	if (outputAudioTracks[i].id === trackId) {
	      	return outputAudioTracks[i];
	      }
	    }

	    for (j = 0; j < outputVideoTracks.length; j += 1) {
	      if (outputVideoTracks[j].id === trackId) {
	      	return outputVideoTracks[j];
	      }
	    }

	    return null;
		};

		stream.polyremoveTrack = function (track) {
			try {
				stream.removeTrack(track);
			} catch (error) {
				// trigger that it has ended
        if (typeof stream.onunsupported === 'function') {
          var eventPayload = returnEventPayloadFn(stream);
          eventPayload.type = 'unsupported';
          eventPayload.error = error;
          eventPayload.feature = 'removeTrack';
          stream.onunsupported(eventPayload);
        }
			}
		};

		stream.polygetAudioTracks = function () {
			return storePolyfillMediaStreamTracks[stream._polyStoreId].audio;
		};

		stream.polygetVideoTracks = function () {
			return storePolyfillMediaStreamTracks[stream._polyStoreId].video;
		};
	};

	window.getUserMedia = function (constraints, successCb, failureCb) {
		navigator.getUserMedia(constraints, function(stream) {

      polyfillMediaStream(stream);

     	successCb(stream);
    }, failureCb);
  };
}