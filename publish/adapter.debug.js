/*! adapterjs - v0.0.2 - 2014-08-14 */

// Temasys Implemented functions
/**
 * Temasys reserved namespace
 * @namespace Temasys
 * @type JSON
 * @requires Temasys Plugin. Please download it from
 *   https://temasys.atlassian.net/wiki/display/TWPP/WebRTC+Plugins
 */
var Temasys = Temasys || {};
/**
 * Temasys WebRTC plugin reserved namespace
 * Temasys Plugin Interface
 * @attribute Temasys.WebRTCPlugin
 * @type JSON
 */
Temasys.WebRTCPlugin = Temasys.WebRTCPlugin || {};
/**
 * This function detects whether or not a plugin is installed
 * - Com name : the company name,
 * - plugName : the plugin name
 * - installedCb : callback if the plugin is detected (no argument)
 * - notInstalledCb : callback if the plugin is not detected (no argument)
 *   Checks if the Plugin is installed
 *  - Check If Not IE (firefox, for example)
 *  - Else If it's IE - we're running IE and do something
 *  - Else Unsupported
 * @method Temasys.WebRTCPlugin.isPluginInstalled
 * @param {String} comName
 * @param {String} plugName
 * @param {Function} installedCb
 * @param {Function} notInstalledCb
 * @return {Boolean} If plugin is installed.
 */
Temasys.WebRTCPlugin.isPluginInstalled = null;
/**
 * Defines webrtc's JS interface according to the plugin's implementation
 * Define Plugin Browsers as WebRTC Interface
 * @method Temasys.WebRTCPlugin.defineWebRTCInterface
 * @type Function
 */
Temasys.WebRTCPlugin.defineWebRTCInterface = null;
/**
 * Check if WebRTC Interface is Defined
 * - This is a Util Function
 * @method Temasys.WebRTCPlugin.isDefined
 * @param {String} variable
 * @type Function
 * @return {Boolean} If variable is defined
 */
Temasys.WebRTCPlugin.isDefined = null;
/**
 * This function will be called if the plugin is needed
 * (browser different from Chrome or Firefox),
 * but the plugin is not installed
 * Override it according to your application logic.
 * @method Temasys.WebRTCPlugin.pluginNeededButNotInstalledCb
 * @private
 */
Temasys.WebRTCPlugin.pluginNeededButNotInstalledCb = null;
/**
 * The Object to store Plugin information
 * @attribute Temasys.WebRTCPlugin.temPluginInfo
 * @type JSON
 * @required
 */
Temasys.WebRTCPlugin.temPluginInfo = {
  pluginId : 'plugin0',
  type : 'application/x-temwebrtcplugin',
  onload : '__TemWebRTCReady0'
};
/**
 * Unique identifier of each opened page
 * @attribute Temasys.WebRTCPlugin.TemPageId
 * @type String
 * @private
 */
Temasys.WebRTCPlugin.TemPageId = Math.random().toString(36).slice(2);
/**
 * Use this whenever you want to call the plugin
 * @attribute Temasys.WebRTCPlugin.TemRTCPlugin
 * @type DOM
 * @protected
 */
Temasys.WebRTCPlugin.TemRTCPlugin = null;
/**
 * WebRTC ready Cb, should only be called once.
 * Need to prevent Chrome + plugin form calling WebRTCReadyCb twice
 * --------------------------------------------------------------------------
 * WebRTCReadyCb is callback function called when the browser is webrtc ready
 * this can be because of the browser or because of the plugin
 * Override WebRTCReadyCb and use it to do whatever you need to do when the
 * page is ready
 * @method Temasys.TemPrivateWebRTCReadyCb
 * @private
 * @deprecated
 */
/*Temasys.WebRTCPlugin.TemPrivateWebRTCReadyCb = function () {
   arguments.callee.StaticWasInit = arguments.callee.StaticWasInit || 1;
   if (arguments.callee.StaticWasInit === 1) {
     if (typeof Temasys.WebRTCReadyCb === 'function') {
       Temasys.WebRTCReadyCb();
     }
   }
   arguments.callee.StaticWasInit++;
 };
*/
/**
 * !!! DO NOT OVERRIDE THIS FUNCTION !!!
 * This function will be called when plugin is ready
 * it sends necessary details to the plugin.
 * If you need to do something once the page/plugin is ready, override
 * WebRTCReadyCb instead.
 * This function is not in the IE/Safari condition brackets so that
 * TemPluginLoaded function might be called on Chrome/Firefox
 * @method __TemWebRTCReady0
 * @private
 */
__TemWebRTCReady0 = function () {
  arguments.callee.StaticWasInit = arguments.callee.StaticWasInit || 1;
  if (arguments.callee.StaticWasInit === 1) {
    Temasys.isPluginReady = true;
    if (typeof Temasys.WebRTCReadyCb === 'function') {
      Temasys.WebRTCReadyCb();
    }
  }
  arguments.callee.StaticWasInit++;
};
/**
 * Called when Plugin is ready to use
 * @method Temasys.WebRTCReadyCb
 */
Temasys.WebRTCReadyCb = function () {
  Temasys.pluginReadyState = Temasys.PLUGIN_READY_STATE.READY;
};
// Temasys implemented functions
/**
 * The results of each states returns
 * @attribute Temasys._ICECONNECTION_STATE
 * @type JSON
 * @param {Integer} INIT  Plugin is loading.
 * @param {Integer} READY Plugin has been loaded and is ready to use
 * @protected
 */
Temasys.PLUGIN_READY_STATE = {
  INIT : 0,
  READY : 1
};
/**
 * The results of each states returns
 * @attribute Temasys._ICECONNECTION_STATE
 * @type JSON
 * @private
 */
Temasys._ICECONNECTION_STATE = {
  STARTING : 'starting',
  CHECKING : 'checking',
  CONNECTED : 'connected',
  COMPLETED : 'connected',
  DONE : 'completed',
  DISCONNECTED : 'disconnected',
  FAILED : 'failed',
  CLOSED : 'closed'
};
/**
 * The ICEConnection states of each Peer
 * @attribute Temasys.ICEConnectionFiredStates
 * @type JSON
 */
Temasys.ICEConnectionFiredStates = {};
/**
 * State of Plugin ready [Rel: Temasys.PLUGIN_READY_STATE]
 * @attribute Temasys.pluginReadyState
 * @type String
 */
Temasys.pluginReadyState = Temasys.PLUGIN_READY_STATE.INIT;
/**
 * To Fix Configuration as some browsers,
 * some browsers does not support the 'urls' attribute
 * - .urls is not supported in FF yet.
 * @attribute maybeFixConfiguration
 * @type Function
 * @param {JSON} pcConfig
 */
maybeFixConfiguration = function (pcConfig) {
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
 * Binds browser name and version and other webrtc support
 * information to navigator object.
 * - Latest Opera supports Webkit WebRTC
 * - IE is detected as Safari
 * - Older Firefox and Chrome does not support WebRTC
 * - Detected "Safari" Browsers:
 *   - Firefox 1.0+
 *   - IE 6+
 *   - Safari 3+: '[object HTMLElementConstructor]'
 *   - Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
 *   - Chrome 1+
 * 1st Step: Get browser OS
 * 2nd Step: Check browser DataChannels Support
 * 3rd Step: Check browser WebRTC Support type
 * 4th Step: Get browser version
 * @author Get version of Browser. Code provided by kennebec@stackoverflow.com
 * @author IsSCTP/isRTPD Supported. Code provided by DetectRTC by Muaz Khan
 * @method Temasys.getDetectedBrowser
 * @return {JSON} Browser information object
 */
getDetectedBrowser = function () {
  var agent = {};
  var hasMatch;
  var checkMatch = navigator.userAgent.match(
    /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  if (navigator.mozGetUserMedia) {
    agent.mozWebRTC = true;
  } else if (navigator.webkitGetUserMedia) {
    agent.webkitWebRTC = true;
  } else {
    if (agent.userAgent.indexOf('Safari')) {
      if (typeof InstallTrigger !== 'undefined') {
        agent.browser = 'Firefox';
      } else if (/*@cc_on!@*/
        false || !!document.documentMode) {
        agent.browser = 'IE';
      } else if (
        Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0) {
        agent.browser = 'Safari';
      } else if (!!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) {
        agent.browser = 'Opera';
      } else if (!!window.chrome) {
        agent.browser = 'Chrome';
      }
      agent.pluginWebRTC = true;
    }
  }
  if (/trident/i.test(checkMatch[1])) {
    hasMatch = /\brv[ :]+(\d+)/g.exec(navigator.userAgent) || [];
    agent.browser = 'IE';
    agent.version = parseInt(hasMatch[1] || '0', 10);
  } else if (checkMatch[1] === 'Chrome') {
    hasMatch = navigator.userAgent.match(/\bOPR\/(\d+)/);
    if (hasMatch !== null) {
      agent.browser = 'Opera';
      agent.version = parseInt(hasMatch[1], 10);
    }
  }
  if (!agent.browser) {
    agent.browser = checkMatch[1];
  }
  if (!agent.version) {
    try {
      checkMatch = (checkMatch[2]) ? [checkMatch[1], checkMatch[2]] :
        [navigator.appName, navigator.appVersion, '-?'];
      if ((hasMatch = navigator.userAgent.match(/version\/(\d+)/i)) !== null) {
        checkMatch.splice(1, 1, hasMatch[1]);
      }
      agent.version = parseInt(checkMatch[1], 10);
    } catch (error) {
      agent.version = 0;
      console.error('Unable to retrieve Navigator version. Reason was:');
      console.error(error);
    }
  }
  agent.os = navigator.platform;
  agent.isSCTPDCSupported = agent.mozWebRTC ||
    (agent.browser === 'Chrome' && agent.version > 30) ||
    (agent.browser === 'Opera' && agent.version > 19);
  agent.isRTPDCSupported = agent.browser === 'Chrome' &&
    agent.version < 30 && agent.version > 24;
  agent.isPluginSupported = !agent.isSCTPDCSupported && !agent.isRTPDCSupported;
  return agent;
};
/**
 * Set the settings for creating DataChannels, MediaStream for Cross-browser compability.
 * This is only for SCTP based support browsers
 * @method checkMediaDataChannelSettings
 * @param {Boolean} isOffer
 * @param {String} peerBrowserAgent
 * @param {Function} callback
 * @param {JSON} constraints
 */
checkMediaDataChannelSettings = function
  (isOffer, peerBrowserAgent, callback, constraints) {
  if (typeof callback !== 'function') {
    return;
  }
  var peerBrowserVersion, beOfferer = false;

  console.log('Self: ' + navigator.browser + ' | Peer: ' + peerBrowserAgent);

  if (peerBrowserAgent.indexOf('|') > -1) {
    peerBrowser = peerBrowserAgent.split('|');
    peerBrowserAgent = peerBrowser[0];
    peerBrowserVersion = parseInt(peerBrowser[1], 10);
    console.info('Peer Browser version: ' + peerBrowserVersion);
  }
  var isLocalFirefox = navigator.mozWebRTC;
  // Nightly version does not require MozDontOfferDataChannel for interop
  var isLocalFirefoxInterop = navigator.mozWebRTC && navigator.version > 30;
  var isPeerFirefox = peerBrowserAgent === 'Firefox';
  var isPeerFirefoxInterop = peerBrowserAgent === 'Firefox' &&
    ((peerBrowserVersion) ? (peerBrowserVersion > 30) : false);

  // Resends an updated version of constraints for MozDataChannel to work
  // If other userAgent is firefox and user is firefox, remove MozDataChannel
  if (isOffer) {
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
    console.log('Set Offer constraints for DataChannel and MediaStream interopability');
    console.dir(constraints);
    callback(constraints);
  } else {
    // Tells user to resend an 'enter' again
    // Firefox (not interopable) cannot offer DataChannel as it will cause problems to the
    // interopability of the media stream
    if (!isLocalFirefox && isPeerFirefox && !isPeerFirefoxInterop) {
      beOfferer = true;
    }
    console.info('Resend Enter: ' + beOfferer);
    callback(beOfferer);
  }
};
/**
 * Handles the differences for all Browsers
 * @method checkIceConnectionState
 * @param {String} peerID
 * @param {String} iceConnectionState
 * @param {Function} callback
 * @param {Boolean} returnStateAlways
 * @protected
 */
checkIceConnectionState = function
  (peerID, iceConnectionState, callback, returnStateAlways) {
  if (typeof callback !== 'function') {
    return;
  }
  peerID = (peerID) ? peerID : 'peer';
  var returnState = false, err = null;
  console.log('ICECONNECTIONSTATE: ' + iceConnectionState);

  if (!Temasys.ICEConnectionFiredStates[peerID] ||
    iceConnectionState === Temasys._ICECONNECTION_STATE.DISCONNECTED ||
    iceConnectionState === Temasys._ICECONNECTION_STATE.FAILED ||
    iceConnectionState === Temasys._ICECONNECTION_STATE.CLOSED) {
    Temasys.ICEConnectionFiredStates[peerID] = [];
  }
  iceConnectionState = Temasys._ICECONNECTION_STATE[iceConnectionState];
  if (Temasys.ICEConnectionFiredStates[peerID].indexOf(iceConnectionState) === -1) {
    Temasys.ICEConnectionFiredStates[peerID].push(iceConnectionState);
    if (iceConnectionState === Temasys._ICECONNECTION_STATE.CONNECTED) {
      setTimeout(function () {
        Temasys.ICEConnectionFiredStates[peerID].push(Temasys._ICECONNECTION_STATE.DONE);
        callback(Temasys._ICECONNECTION_STATE.DONE);
      }, 1000);
    }
    returnState = true;
  }
  if (returnStateAlways || returnState) {
    callback(iceConnectionState);
  }
  return;
};
/**
 * Check the availability of the MediaStream and DataChannel.
 * Method to be called after getUserMedia
 * @method checkMediaDataChannel
 * @param {MediaStream} stream
 * @param {JSON} constraints
 */
checkMediaDataChannel = function (stream, constraints) {
  var testedOptions = {
    audio : false,
    video : false,
    data : false
  };
  // Test MediaStream
  if (constraints.audio && stream.getAudioTracks().length > 0) {
    testedOptions.audio = true;
  }
  if (constraints.video && stream.getVideoTracks().length > 0) {
    testedOptions.video = true;
  }
  // Test DataChannel
  var testPeer = new RTCPeerConnection();
  try {
    var dc = testPeer.createDataChannel('_');
    if (dc) {
      testedOptions.data = true;
    }
  } catch (error) {
    console.error('Failed creating DataChannel');
    console.error(error);
  }
  return testedOptions;
};
// AdapterJS functions from original Google Code
/**
 * Original Google Code. The RTCPeerConnection object.
 * @function RTCPeerConnection
 * @param {JSON} pcConfig Servers configuration
 * @param {JSON} pcConstraints Constraints
 * @return {Object} The PeerConnection object.
 */
RTCPeerConnection = null;
/**
 * Plugin:
 * - Creates RTCSessionDescription object for Plugin Browsers
 *   - This is a WebRTC Function
 * @method RTCSessionDescription
 * @param {JSON} info
 * @return {Object} The RTCSessionDescription object
 */
RTCSessionDescription = RTCSessionDescription || null;
/**
 * Plugin:
 * - Creates RTCIceCandidate object for Plugin Browsers
 *   - This is a WebRTC Function
 * @method RTCIceCandidate
 * @param {Object} candidate
 * @return {Object} The RTCIceCandidate object
 */
RTCIceCandidate = RTCIceCandidate || null;
/**
 * Original Google Code. Get UserMedia (only difference is the prefix).
 * @function getUserMedia
 * @param {JSON} mediaConstraints Media constraints
 * @param {JSON} successCallback Callback when MediaStream is obtained
 *   successfully.
 * @param {JSON} failuedCallback Callback when MediaStream failed to
 *   be obtained.
 * @return {Object} The MediaStream object.
 * @author Adam Barth.
 */
getUserMedia = null;
/**
 * Original Google Code. Attach a media stream to an element.
 * @function attachMediaStream
 * @param {DOM} videoElement The Video element
 * @param {Object} mediaStream The MediaStream object
 */
attachMediaStream = null;
/**
 * Original Google Code. Re-attach a media stream to an element.
 * @function reattachMediaStream
 * @param {DOM} fromVideoElement The Video element with the stream url
 * @param {DOM} toVideoElement The Video element to be duplicated with
 *   the stream url.
 */
reattachMediaStream = null;
/**
 * Original Google Code.
 * Firefox:
 * - Creates iceServer from the url for Firefox.
 * - Create iceServer with stun url.
 * - Create iceServer with turn url.
 *   - Ignore the transport parameter from TURN url for FF version <=27.
 *   - Return null for createIceServer if transport=tcp.
 * - FF 27 and above supports transport parameters in TURN url,
 *   - So passing in the full url to create iceServer.
 * Chrome:
 * - Creates iceServer from the url for Chrome M33 and earlier.
 *   - Create iceServer with stun url.
 *   - Chrome M28 & above uses below TURN format.
 * Plugin:
 * - Creates Ice Server for Plugin Browsers
 *   - If Stun - Create iceServer with stun url.
 *   - Else - Create iceServer with turn url
 *   - This is a WebRTC Function
 * @method createIceServer
 * @param {String} url
 * @param {String} username
 * @param {String} password
 * @return {JSON} Ice Server Configuration
 */
createIceServer = null;
/**
 * Firefox:
 * - Creates IceServers for Firefox
 *   - Use .url for FireFox.
 *   - Multiple Urls support
 * Chrome:
 * - Creates iceServers from the urls for Chrome M34 and above.
 *   - .urls is supported since Chrome M34.
 *   - Multiple Urls support
 * Plugin:
 * - Creates Ice Servers for Plugin Browsers
 *   - Multiple Urls support
 *   - This is a WebRTC Function
 * @method createIceServers
 * @param {Array} urls
 * @param {String} username
 * @param {String} password
 * @return {Array} List of Ice Servers Configuration
 */
createIceServers = null;
/**
 * Firefox:
 * - Creates IceServers for Firefox
 *   - Use .url for FireFox.
 *   - Multiple Urls support
 * Chrome:
 * - Creates iceServers from the urls for Chrome M34 and above.
 *   - .urls is supported since Chrome M34.
 *   - Multiple Urls support
 * Plugin:
 * - Creates Ice Servers for Plugin Browsers
 *   - Multiple Urls support
 *   - This is a WebRTC Function
 * @method createIceServers
 * @param {Array} urls
 * @param {String} username
 * @param {String} password
 * @return {Array} List of Ice Servers Configuration
 */
createIceServers = null;
/**
 * The browser information
 * @attribute webrtcDetectedBrowser
 * @type JSON
 * @param {String} browser The browser name
 * @param {Integer} version The browser version
 * @param {Boolean} webkitWebRTC The browser uses webkit implementation of WebRTC
 * @param {Boolean} mozWebRTC The browser uses moz implementation of WebRTC
 * @param {Boolean} pluginWebRTC The browser uses the plugin implementation of WebRTC
 * @param {String} os The browser Operating System/Platform
 * @param {Boolean} isSCTPDCSupported If browser supports SCTP DataChannels
 * @param {Boolean} isRTPDCSupported If browser supports RTP DataChannels
 * @param {Boolean} isPluginSupported If browser is using the Plugin DataChannels
 */
webrtcDetectedBrowser = getDetectedBrowser();
// Check for browser types and react accordingly
if (webrtcDetectedBrowser.mozWebRTC) {
  RTCPeerConnection = function (pcConfig, pcConstraints) {
    maybeFixConfiguration(pcConfig);
    return new mozRTCPeerConnection(pcConfig, pcConstraints);
  };

  RTCSessionDescription = mozRTCSessionDescription;
  RTCIceCandidate = mozRTCIceCandidate;
  getUserMedia = navigator.mozGetUserMedia.bind(navigator);
  navigator.getUserMedia = getUserMedia;

  createIceServer = function (url, username, password) {
    var iceServer = null;
    var url_parts = url.split(':');
    if (url_parts[0].indexOf('stun') === 0) {
      iceServer = { 'url' : url };
    } else if (url_parts[0].indexOf('turn') === 0) {
      if (webrtcDetectedBrowser.version < 27) {
        var turn_url_parts = url.split('?');
        if (turn_url_parts.length === 1 || turn_url_parts[1].indexOf('transport=udp') === 0) {
          iceServer = {
            'url' : turn_url_parts[0],
            'credential' : password,
            'username' : username
          };
        }
      } else {
        iceServer = {
          'url' : url,
          'credential' : password,
          'username' : username
        };
      }
    }
    return iceServer;
  };

  createIceServers = function (urls, username, password) {
    var iceServers = [];
    for (i = 0; i < urls.length; i++) {
      var iceServer = createIceServer(urls[i], username, password);
      if (iceServer !== null) {
        iceServers.push(iceServer);
      }
    }
    return iceServers;
  };

  attachMediaStream = function (element, stream) {
    console.log('Attaching media stream');
    element.mozSrcObject = stream;
    element.play();
    return element;
  };

  reattachMediaStream = function (to, from) {
    console.log('Reattaching media stream');
    to.mozSrcObject = from.mozSrcObject;
    to.play();
    return to;
  };

  // Fake get{Video,Audio}Tracks
  if (!MediaStream.prototype.getVideoTracks) {
    MediaStream.prototype.getVideoTracks = function () {
      return [];
    };
  }
  if (!MediaStream.prototype.getAudioTracks) {
    MediaStream.prototype.getAudioTracks = function () {
      return [];
    };
  }
  __TemWebRTCReady0();
} else if (webrtcDetectedBrowser.webkitWebRTC) {
  createIceServer = function (url, username, password) {
    var iceServer = null;
    var url_parts = url.split(':');
    if (url_parts[0].indexOf('stun') === 0) {
      iceServer = { 'url' : url };
    } else if (url_parts[0].indexOf('turn') === 0) {
      iceServer = {
        'url' : url,
        'credential' : password,
        'username' : username
      };
    }
    return iceServer;
  };

  createIceServers = function (urls, username, password) {
    var iceServers = [];
    if (webrtcDetectedBrowser.version >= 34) {
      iceServers = {
        'urls' : urls,
        'credential' : password,
        'username' : username
      };
    } else {
      for (i = 0; i < urls.length; i++) {
        var iceServer = createIceServer(urls[i], username, password);
        if (iceServer !== null) {
          iceServers.push(iceServer);
        }
      }
    }
    return iceServers;
  };

  RTCPeerConnection = function (pcConfig, pcConstraints) {
    if (webrtcDetectedBrowser.version < 34) {
      maybeFixConfiguration(pcConfig);
    }
    return new webkitRTCPeerConnection(pcConfig, pcConstraints);
  };

  getUserMedia = navigator.webkitGetUserMedia.bind(navigator);
  navigator.getUserMedia = getUserMedia;

  attachMediaStream = function (element, stream) {
    if (typeof element.srcObject !== 'undefined') {
      element.srcObject = stream;
    } else if (typeof element.mozSrcObject !== 'undefined') {
      element.mozSrcObject = stream;
    } else if (typeof element.src !== 'undefined') {
      element.src = URL.createObjectURL(stream);
    } else {
      console.log('Error attaching stream to element.');
    }
    return element;
  };

  reattachMediaStream = function (to, from) {
    to.src = from.src;
    return to;
  };
  __TemWebRTCReady0();
} else if (webrtcDetectedBrowser.pluginWebRTC) {
  // var isOpera = webrtcDetectedBrowser.browser === 'Opera'; // Might not be used.
  var isFirefox = webrtcDetectedBrowser.browser === 'Firefox';
  var isSafari = webrtcDetectedBrowser.browser === 'Safari';
  var isChrome = webrtcDetectedBrowser.browser === 'Chrome';
  var isIE = webrtcDetectedBrowser.browser === 'IE';

  // Load Plugin
  Temasys.WebRTCPlugin.TemRTCPlugin = document.createElement('object');
  Temasys.WebRTCPlugin.TemRTCPlugin.id = Temasys.WebRTCPlugin.temPluginInfo.pluginId;
  // IE will only start the plugin if it's ACTUALLY visible
  if (isIE) {
    Temasys.WebRTCPlugin.TemRTCPlugin.width = '1px';
    Temasys.WebRTCPlugin.TemRTCPlugin.height = '1px';
  } else {
    Temasys.WebRTCPlugin.TemRTCPlugin.style.visibility = 'hidden';
    Temasys.WebRTCPlugin.TemRTCPlugin.width = '1px';
    Temasys.WebRTCPlugin.TemRTCPlugin.height = '1px';
    Temasys.WebRTCPlugin.TemRTCPlugin.type = Temasys.WebRTCPlugin.temPluginInfo.type;
    Temasys.WebRTCPlugin.TemRTCPlugin.innerHTML = '<param name="onload" value="' +
    Temasys.WebRTCPlugin.temPluginInfo.onload + '">' +
    '<param name="pluginId" value="' +
    Temasys.WebRTCPlugin.temPluginInfo.pluginId + '">' +
    '<param name="windowless" value="false" /> ' +
    '<param name="pageId" value="' + Temasys.WebRTCPlugin.TemPageId + '">';
    document.body.appendChild(Temasys.WebRTCPlugin.TemRTCPlugin);
  }

  // FIXEM: dead code?
  Temasys.WebRTCPlugin.TemRTCPlugin.onreadystatechange = function (state) {
    console.log('Plugin: Ready State : ' + state);
    if (state === 4) {
      console.log('Plugin has been loaded');
    }
  };

  Temasys.WebRTCPlugin.isPluginInstalled =
    function (comName, plugName, installedCb, notInstalledCb) {
    if (isChrome || isSafari || isFirefox) {
      var pluginArray = navigator.plugins;
      for (var i = 0; i < pluginArray.length; i++) {
        if (pluginArray[i].name.indexOf(plugName) >= 0) {
          installedCb();
          return;
        }
      }
      notInstalledCb();
    } else if (isIE) {
      try {
        var axo = new ActiveXObject(comName + '.' + plugName);
      } catch (e) {
        notInstalledCb();
        return;
      }
      installedCb();
    } else {
      return;
    }
  };

  Temasys.WebRTCPlugin.defineWebRTCInterface = function () {
    Temasys.WebRTCPlugin.isDefined = function (variable) {
      return variable !== null && variable !== undefined;
    };

    createIceServer = function (url, username, password) {
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

    createIceServers = function (urls, username, password) {
      var iceServers = [];
      for (var i = 0; i < urls.length; ++i) {
        iceServers.push(createIceServer(urls[i], username, password));
      }
      return iceServers;
    };

    RTCSessionDescription = function (info) {
      return Temasys.WebRTCPlugin.TemRTCPlugin.ConstructSessionDescription(info.type, info.sdp);
    };

    RTCPeerConnection = function (servers, constraints) {
      var iceServers = null;
      if (servers) {
        iceServers = servers.iceServers;
        for (var i = 0; i < iceServers.length; i++) {
          if (iceServers[i].urls && !iceServers[i].url) {
            iceServers[i].url = iceServers[i].urls;
          }
          iceServers[i].hasCredentials = Temasys.WebRTCPlugin.isDefined(iceServers[i].username) &&
          Temasys.WebRTCPlugin.isDefined(iceServers[i].credential);
        }
      }
      var mandatory = (constraints && constraints.mandatory) ? constraints.mandatory : null;
      var optional = (constraints && constraints.optional) ? constraints.optional : null;
      return Temasys.WebRTCPlugin.TemRTCPlugin.PeerConnection(Temasys.WebRTCPlugin.TemPageId,
        iceServers, mandatory, optional);
    };

    MediaStreamTrack = {};
    MediaStreamTrack.getSources = function (callback) {
      Temasys.WebRTCPlugin.TemRTCPlugin.GetSources(callback);
    };

    getUserMedia = function (constraints, successCallback, failureCallback) {
      if (!constraints.audio) {
        constraints.audio = false;
      }
      Temasys.WebRTCPlugin.TemRTCPlugin.getUserMedia(constraints, successCallback, failureCallback);
    };
    navigator.getUserMedia = getUserMedia;

    attachMediaStream = function (element, stream) {
      stream.enableSoundTracks(true);
      if (element.nodeName.toLowerCase() !== 'audio') {
        var elementId = element.id.length === 0 ? Math.random().toString(36).slice(2) : element.id;
        if (!element.isTemWebRTCPlugin || !element.isTemWebRTCPlugin()) {
          var frag = document.createDocumentFragment();
          var temp = document.createElement('div');
          var classHTML = (element.className) ? 'class="' + element.className + '" ' : '';
          temp.innerHTML = '<object id="' + elementId + '" ' + classHTML +
            'type="application/x-temwebrtcplugin">' +
            '<param name="pluginId" value="' + elementId + '" /> ' +
            '<param name="pageId" value="' + Temasys.WebRTCPlugin.TemPageId + '" /> ' +
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
        newElement.onclick = (element.onclick) ? element.onclick : function (arg) {};
        newElement._TemOnClick = function (id) {
          var arg = {
            srcElement : document.getElementById(id)
          };
          newElement.onclick(arg);
        };
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
          stream = Temasys.WebRTCPlugin.TemRTCPlugin
            .getStreamWithId(Temasys.WebRTCPlugin.TemPageId, children[i].value);
          break;
        }
      }
      if (stream !== null) {
        return attachMediaStream(to, stream);
      } else {
        console.log('Could not find the stream associated with this element');
      }
    };

    RTCIceCandidate = function (candidate) {
      if (!candidate.sdpMid) {
        candidate.sdpMid = '';
      }
      return Temasys.WebRTCPlugin.TemRTCPlugin.ConstructIceCandidate(
        candidate.sdpMid, candidate.sdpMLineIndex, candidate.candidate
      );
    };
  };

  Temasys.WebRTCPlugin.getWebsiteLink = function() {
    return 'http://temasys.atlassian.net/wiki/display/TWPP/WebRTC+Plugins';
  };

  Temasys.WebRTCPlugin.getDownloadLink = function() {
    if(!!navigator.platform.match(/^Mac/i)) {
      return 'http://bit.ly/1n77hco';
    }
    else if(!!navigator.platform.match(/^Win/i)) {
      return 'http://bit.ly/1kkS4FN';
    }
    return null;
  };

  Temasys.WebRTCPlugin.pluginNeededButNotInstalledCb = function () {
    var downloadLink = Temasys.WebRTCPlugin.getDownloadLink();
    if(downloadLink) {
      Temasys.WebRTCPlugin.renderNotificationBar('This website needs to install the <a href="' +
        Temasys.WebRTCPlugin.getWebsiteLink() + '" target="_blank">Temasys WebRTC Plugin</a>' +
        ' to upgrade your browser.', 'Install Now', downloadLink);
    }
    else {
      Temasys.WebRTCPlugin.renderNotificationBar('Your browser does not support WebRTC.');
    }
  };

  Temasys.WebRTCPlugin.pluginNeedsUpgrade = function (downloadLink) {
    Temasys.WebRTCPlugin.renderNotificationBar('There is a new version of the <a href="' +
      Temasys.WebRTCPlugin.getWebsiteLink() + '" target="_blank">' +
      'Temasys WebRTC Plugin</a> available.',
      'Update Now', downloadLink||Temasys.WebRTCPlugin.getDownloadLink());
  };

  Temasys.WebRTCPlugin.renderNotificationBar = function (text, buttonText, buttonLink) {
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
      c.document.getElementById('okay').addEventListener('click', function(e) {
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
    c.document.addEventListener('click', function() {
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
  Temasys.WebRTCPlugin.isPluginInstalled('Tem', 'TemWebRTCPlugin',
    Temasys.WebRTCPlugin.defineWebRTCInterface,
    Temasys.WebRTCPlugin.pluginNeededButNotInstalledCb);
} else {
  console.log('Browser does not appear to be WebRTC-capable');
}
