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
AdapterJS.VERSION = '@@version';

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