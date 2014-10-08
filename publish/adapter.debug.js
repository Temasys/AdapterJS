/*! adapterjs - v0.9.3 - 2014-10-08 */

// Temasys reserved namespace.
// This are where all Temasys implemented functions are.
var Temasys = Temasys || {};

// Temasys plugin interface.
// Please download our plugin for Safari and IE users:
// https://temasys.atlassian.net/wiki/display/TWPP/WebRTC+Plugins
Temasys.WebRTCPlugin = Temasys.WebRTCPlugin || {};

// The object to store plugin information
Temasys.WebRTCPlugin.temPluginInfo = {
  pluginId : 'plugin0',
  type : 'application/x-temwebrtcplugin',
  onload : '__TemWebRTCReady0'
};

// Unique identifier of each opened page
Temasys.WebRTCPlugin.TemPageId = Math.random().toString(36).slice(2);

// Use this whenever you want to call the plugin.
Temasys.WebRTCPlugin.TemRTCPlugin = null;

// Defines webrtc's JS interface according to the plugin's implementation.
// Define plugin Browsers as WebRTC Interface.
Temasys.WebRTCPlugin.defineWebRTCInterface = null;

// This function detects whether or not a plugin is installed.
// Checks if Not IE (firefox, for example), else if it's IE,
// we're running IE and do something. If not it is not supported.
Temasys.WebRTCPlugin.isPluginInstalled = null;

// Check if WebRTC Interface is defined.
Temasys.WebRTCPlugin.isDefined = null;

 // Lets adapter.js wait until the the document is ready before injecting the plugin
Temasys.WebRTCPlugin.pluginInjectionInterval = null;

// Inject the HTML DOM object element into the page.
Temasys.WebRTCPlugin.injectPlugin = null;

Temasys.WebRTCPlugin.PLUGIN_STATES = {
  NONE : 0,           // no plugin use
  INITIALIZING : 1,   // Detected need for plugin
  INJECTING : 2,      // Injecting plugin
  INJECTED: 3,        // Plugin element injected but not usable yet
  READY: 4            // Plugin ready to be used
};

// Current state of the plugin. You cannot use the plugin before this is
// equal to Temasys.WebRTCPlugin.PLUGIN_STATES.READY
Temasys.WebRTCPlugin.pluginState = Temasys.WebRTCPlugin.PLUGIN_STATES.NONE;

// Does a waiting check before proceeding to load the plugin.
Temasys.WebRTCPlugin.WaitForPluginReady = null;

// This methid will use an interval to wait for the plugin to be ready.
Temasys.WebRTCPlugin.callWhenPluginReady = null;

// This function will be called if the plugin is needed (browser different
// from Chrome or Firefox), but the plugin is not installed.
// Override it according to your application logic.
Temasys.WebRTCPlugin.pluginNeededButNotInstalledCb = null;

// !!!! WARNING: DO NOT OVERRIDE THIS FUNCTION. !!!
// This function will be called when plugin is ready. It sends necessary
// details to the plugin.
// If you need to do something once the page/plugin is ready, override
// window.onwebrtcready instead.
// This function is not in the IE/Safari condition brackets so that
// TemPluginLoaded function might be called on Chrome/Firefox.
// This function is the only private function that is not encapsulated to
// allow the plugin method to be called.
__TemWebRTCReady0 = function () {
  arguments.callee.StaticWasInit = arguments.callee.StaticWasInit || 1;
  if (arguments.callee.StaticWasInit === 1) {
    Temasys.WebRTCPlugin.documentReadyInterval = setInterval(function () {
      if (document.readyState === 'complete') {
        // TODO: update comments, we wait for the document to be ready
        clearInterval(Temasys.WebRTCPlugin.documentReadyInterval);
        Temasys.WebRTCPlugin.pluginState = Temasys.WebRTCPlugin.PLUGIN_STATES.READY;
      }
    }, 100);
  }
  arguments.callee.StaticWasInit++;
};

// Temasys Adapter's interface.
Temasys.AdapterJS={};

// Temasys AdapterJS version
Temasys.AdapterJS.VERSION = '0.9.3';

// The result of ice connection states.
// - starting: Ice connection is starting.
// - checking: Ice connection is checking.
// - connected Ice connection is connected.
// - completed Ice connection is connected.
// - done Ice connection has been completed.
// - disconnected Ice connection has been disconnected.
// - failed Ice connection has failed.
// - closed Ice connection is closed.
Temasys.AdapterJS._iceConnectionStates = {
  starting : 'starting',
  checking : 'checking',
  connected : 'connected',
  completed : 'connected',
  done : 'completed',
  disconnected : 'disconnected',
  failed : 'failed',
  closed : 'closed'
};

//The IceConnection states that has been fired for each peer.
Temasys.AdapterJS._iceConnectionFiredStates = [];

// This function helps to retrieve the webrtc detected browser information.
// This sets:
// - webrtcDetectedBrowser: The browser agent name.
// - webrtcDetectedVersion: The browser version.
// - webrtcDetectedType: The types of webRTC support.
//   - 'moz': Mozilla implementation of webRTC.
//   - 'webkit': WebKit implementation of webRTC.
//   - 'plugin': Using Temasys's plugin implementation.
Temasys.AdapterJS.parseWebrtcDetectedBrowser = function () {
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

// To fix configuration as some browsers does not support
// the 'urls' attribute.
Temasys.AdapterJS.maybeFixConfiguration = function (pcConfig) {
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

//// Codes in meant to be in Temasys.AdapterJS
// -----------------------------------------------------------
// Detected webrtc implementation. Types are:
// - 'moz': Mozilla implementation of webRTC.
// - 'webkit': WebKit implementation of webRTC.
// - 'plugin': Using Temasys's plugin implementation.
webrtcDetectedType = null;

// Detected webrtc datachannel support. Types are:
// - 'SCTP': SCTP datachannel support.
// - 'RTP': RTP datachannel support.
webrtcDetectedDCSupport = null;

// Set the settings for creating DataChannels, MediaStream for
// Cross-browser compability.
// - This is only for SCTP based support browsers.
// the 'urls' attribute.
checkMediaDataChannelSettings =
  function (peerBrowserAgent, peerBrowserVersion, callback, constraints) {
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

// Handles the differences for all browsers ice connection state output.
// - Tested outcomes are:
//   - Chrome (offerer)  : 'checking' > 'completed' > 'completed'
//   - Chrome (answerer) : 'checking' > 'connected'
//   - Firefox (offerer) : 'checking' > 'connected'
//   - Firefox (answerer): 'checking' > 'connected'
checkIceConnectionState = function (peerId, iceConnectionState, callback) {
  if (typeof callback !== 'function') {
    console.warn('No callback specified in checkIceConnectionState. Aborted.');
    return;
  }
  peerId = (peerId) ? peerId : 'peer';

  if (!Temasys.AdapterJS._iceConnectionFiredStates[peerId] ||
    iceConnectionState === Temasys.AdapterJS._iceConnectionStates.disconnected ||
    iceConnectionState === Temasys.AdapterJS._iceConnectionStates.failed ||
    iceConnectionState === Temasys.AdapterJS._iceConnectionStates.closed) {
    Temasys.AdapterJS._iceConnectionFiredStates[peerId] = [];
  }
  iceConnectionState = Temasys.AdapterJS._iceConnectionStates[iceConnectionState];
  if (Temasys.AdapterJS._iceConnectionFiredStates[peerId].indexOf(iceConnectionState) < 0) {
    Temasys.AdapterJS._iceConnectionFiredStates[peerId].push(iceConnectionState);
    if (iceConnectionState === Temasys.AdapterJS._iceConnectionStates.connected) {
      setTimeout(function () {
        Temasys.AdapterJS._iceConnectionFiredStates[peerId]
          .push(Temasys.AdapterJS._iceConnectionStates.done);
        callback(Temasys.AdapterJS._iceConnectionStates.done);
      }, 1000);
    }
    callback(iceConnectionState);
  }
  return;
};

// Firefox:
// - Creates iceServer from the url for Firefox.
// - Create iceServer with stun url.
// - Create iceServer with turn url.
//   - Ignore the transport parameter from TURN url for FF version <=27.
//   - Return null for createIceServer if transport=tcp.
// - FF 27 and above supports transport parameters in TURN url,
// - So passing in the full url to create iceServer.
// Chrome:
// - Creates iceServer from the url for Chrome M33 and earlier.
//   - Create iceServer with stun url.
//   - Chrome M28 & above uses below TURN format.
// Plugin:
// - Creates Ice Server for Plugin Browsers
//   - If Stun - Create iceServer with stun url.
//   - Else - Create iceServer with turn url
//   - This is a WebRTC Function
createIceServer = null;

// Firefox:
// - Creates IceServers for Firefox
//   - Use .url for FireFox.
//   - Multiple Urls support
// Chrome:
// - Creates iceServers from the urls for Chrome M34 and above.
//   - .urls is supported since Chrome M34.
//   - Multiple Urls support
// Plugin:
// - Creates Ice Servers for Plugin Browsers
//   - Multiple Urls support
//   - This is a WebRTC Function
createIceServers = null;
//------------------------------------------------------------

//The RTCPeerConnection object.
RTCPeerConnection = null;

// Creates RTCSessionDescription object for Plugin Browsers
RTCSessionDescription = (typeof RTCSessionDescription === 'function') ?
  RTCSessionDescription : null;

// Creates RTCIceCandidate object for Plugin Browsers
RTCIceCandidate = (typeof RTCIceCandidate === 'function') ?
  RTCIceCandidate : null;

// Get UserMedia (only difference is the prefix).
// Code from Adam Barth.
getUserMedia = null;

// Attach a media stream to an element.
attachMediaStream = null;

// Re-attach a media stream to an element.
reattachMediaStream = null;


// Detected browser agent name. Types are:
// - 'firefox': Firefox browser.
// - 'chrome': Chrome browser.
// - 'opera': Opera browser.
// - 'safari': Safari browser.
// - 'IE' - Internet Explorer browser.
webrtcDetectedBrowser = null;

// Detected browser version.
webrtcDetectedVersion = null;

// Check for browser types and react accordingly
if (navigator.mozGetUserMedia) {
  webrtcDetectedBrowser = 'firefox';
  webrtcDetectedVersion = parseInt(navigator
    .userAgent.match(/Firefox\/([0-9]+)\./)[1], 10);
  webrtcDetectedType = 'moz';
  webrtcDetectedDCSupport = 'SCTP';

  RTCPeerConnection = function (pcConfig, pcConstraints) {
    Temasys.AdapterJS.maybeFixConfiguration(pcConfig);
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
      iceServer = { url : url };
    } else if (url_parts[0].indexOf('turn') === 0) {
      if (webrtcDetectedVersion < 27) {
        var turn_url_parts = url.split('?');
        if (turn_url_parts.length === 1 ||
          turn_url_parts[1].indexOf('transport=udp') === 0) {
          iceServer = {
            url : turn_url_parts[0],
            credential : password,
            username : username
          };
        }
      } else {
        iceServer = {
          url : url,
          credential : password,
          username : username
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
    element.mozSrcObject = stream;
    element.play();
    return element;
  };

  reattachMediaStream = function (to, from) {
    to.mozSrcObject = from.mozSrcObject;
    to.play();
    return to;
  };

  MediaStreamTrack.getSources = MediaStreamTrack.getSources || function (callback) {
    if (!callback) {
      throw new TypeError('Failed to execute \'getSources\' on \'MediaStreamTrack\'' +
        ': 1 argument required, but only 0 present.');
    }
    return callback([]);
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
} else if (navigator.webkitGetUserMedia) {
  webrtcDetectedBrowser = 'chrome';
  webrtcDetectedType = 'webkit';
  webrtcDetectedVersion = parseInt(navigator
    .userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)[2], 10);
  // check if browser is opera 20+
  var checkIfOpera = navigator.userAgent.match(/\bOPR\/(\d+)/);
  if (checkIfOpera !== null) {
    webrtcDetectedBrowser = 'opera';
    webrtcDetectedVersion = parseInt(checkIfOpera[1], 10);
  }
  // check browser datachannel support
  if ((webrtcDetectedBrowser === 'chrome' && webrtcDetectedVersion >= 31) ||
    (webrtcDetectedBrowser === 'opera' && webrtcDetectedVersion >= 20)) {
    webrtcDetectedDCSupport = 'SCTP';
  } else if (webrtcDetectedBrowser === 'chrome' && webrtcDetectedVersion < 30 &&
    webrtcDetectedVersion > 24) {
    webrtcDetectedDCSupport = 'RTP';
  } else {
    webrtcDetectedDCSupport = '';
  }

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
    if (webrtcDetectedVersion >= 34) {
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
    if (webrtcDetectedVersion < 34) {
      Temasys.AdapterJS.maybeFixConfiguration(pcConfig);
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
} else { // TRY TO USE PLUGIN
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
  Temasys.AdapterJS.parseWebrtcDetectedBrowser();
  isIE = webrtcDetectedBrowser === 'IE';

  /* jshint -W035 */
  Temasys.WebRTCPlugin.WaitForPluginReady = function() {
    while (Temasys.WebRTCPlugin.pluginState !== Temasys.WebRTCPlugin.PLUGIN_STATES.READY) {
      /* empty because it needs to prevent the function from running. */
    }
  };
  /* jshint +W035 */

  Temasys.WebRTCPlugin.callWhenPluginReady = function (callback) {
    var checkPluginReadyState = setInterval(function () {
      if (Temasys.WebRTCPlugin.pluginState === Temasys.WebRTCPlugin.PLUGIN_STATES.READY) {
        clearInterval(checkPluginReadyState);
        callback();
      }
    }, 100);
  };

  Temasys.WebRTCPlugin.injectPlugin = function () {
    // only inject once the page is ready
    if (document.readyState !== 'complete')
      return;

    // Prevent multiple injections
    if (Temasys.WebRTCPlugin.pluginState !== Temasys.WebRTCPlugin.PLUGIN_STATES.INITIALIZING)
      return;

    Temasys.WebRTCPlugin.pluginState = Temasys.WebRTCPlugin.PLUGIN_STATES.INJECTING;

    if (webrtcDetectedBrowser === 'IE' && webrtcDetectedVersion <= 10) {
      var frag = document.createDocumentFragment();
      Temasys.WebRTCPlugin.TemRTCPlugin = document.createElement('div');
      Temasys.WebRTCPlugin.TemRTCPlugin.innerHTML = '<object id="' +
        Temasys.WebRTCPlugin.temPluginInfo.pluginId + '" type="' +
        Temasys.WebRTCPlugin.temPluginInfo.type + '" ' + 'width="1" height="1">' +
        '<param name="pluginId" value="' +
        Temasys.WebRTCPlugin.temPluginInfo.pluginId + '" /> ' +
        '<param name="windowless" value="false" /> ' +
        '<param name="pageId" value="' + Temasys.WebRTCPlugin.TemPageId + '" /> ' +
        '<param name="onload" value="' + Temasys.WebRTCPlugin.temPluginInfo.onload +
        '" />' +
        // uncomment to be able to use virtual cams
        // '<param name="forceGetAllCams" value="True" />' +
        '</object>';
      while (Temasys.WebRTCPlugin.TemRTCPlugin.firstChild) {
        frag.appendChild(Temasys.WebRTCPlugin.TemRTCPlugin.firstChild);
      }
      document.body.appendChild(frag);

      // Need to re-fetch the plugin
      Temasys.WebRTCPlugin.TemRTCPlugin =
        document.getElementById(Temasys.WebRTCPlugin.temPluginInfo.pluginId);
    } else {
      // Load Plugin
      Temasys.WebRTCPlugin.TemRTCPlugin = document.createElement('object');
      Temasys.WebRTCPlugin.TemRTCPlugin.id =
        Temasys.WebRTCPlugin.temPluginInfo.pluginId;
      // IE will only start the plugin if it's ACTUALLY visible
      if (isIE) {
        Temasys.WebRTCPlugin.TemRTCPlugin.width = '1px';
        Temasys.WebRTCPlugin.TemRTCPlugin.height = '1px';
      }
      Temasys.WebRTCPlugin.TemRTCPlugin.width = '1px';
      Temasys.WebRTCPlugin.TemRTCPlugin.height = '1px';
      Temasys.WebRTCPlugin.TemRTCPlugin.type = Temasys.WebRTCPlugin.temPluginInfo.type;
      Temasys.WebRTCPlugin.TemRTCPlugin.innerHTML = '<param name="onload" value="' +
        Temasys.WebRTCPlugin.temPluginInfo.onload + '">' +
        '<param name="pluginId" value="' +
        Temasys.WebRTCPlugin.temPluginInfo.pluginId + '">' +
        '<param name="windowless" value="false" /> ' +
        // uncomment to be able to use virtual cams
        // '<param name="forceGetAllCams" value="True" />' +
        '<param name="pageId" value="' + Temasys.WebRTCPlugin.TemPageId + '">';
      document.body.appendChild(Temasys.WebRTCPlugin.TemRTCPlugin);
    }


    Temasys.WebRTCPlugin.pluginState = Temasys.WebRTCPlugin.PLUGIN_STATES.INJECTED;
  };

  Temasys.WebRTCPlugin.isPluginInstalled =
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

  Temasys.WebRTCPlugin.defineWebRTCInterface = function () {
    Temasys.WebRTCPlugin.pluginState = Temasys.WebRTCPlugin.PLUGIN_STATES.INITIALIZING;

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
      Temasys.WebRTCPlugin.WaitForPluginReady();
      return Temasys.WebRTCPlugin.TemRTCPlugin.
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
          iceServers[i].hasCredentials = Temasys.WebRTCPlugin.
            isDefined(iceServers[i].username) &&
            Temasys.WebRTCPlugin.isDefined(iceServers[i].credential);
        }
      }
      var mandatory = (constraints && constraints.mandatory) ?
        constraints.mandatory : null;
      var optional = (constraints && constraints.optional) ?
        constraints.optional : null;

      Temasys.WebRTCPlugin.WaitForPluginReady();
      return Temasys.WebRTCPlugin.TemRTCPlugin.
        PeerConnection(Temasys.WebRTCPlugin.TemPageId,
        iceServers, mandatory, optional);
    };

    MediaStreamTrack = {};
    MediaStreamTrack.getSources = function (callback) {
      Temasys.WebRTCPlugin.callWhenPluginReady(function() {
        Temasys.WebRTCPlugin.TemRTCPlugin.GetSources(callback);
      });
    };

    getUserMedia = function (constraints, successCallback, failureCallback) {
      if (!constraints.audio) {
        constraints.audio = false;
      }

      Temasys.WebRTCPlugin.callWhenPluginReady(function() {
        Temasys.WebRTCPlugin.TemRTCPlugin.
          getUserMedia(constraints, successCallback, failureCallback);
      });
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
          Temasys.WebRTCPlugin.WaitForPluginReady();
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

      Temasys.WebRTCPlugin.WaitForPluginReady();
      return Temasys.WebRTCPlugin.TemRTCPlugin.ConstructIceCandidate(
        candidate.sdpMid, candidate.sdpMLineIndex, candidate.candidate
      );
    };

    // inject plugin
    document.addEventListener('readystatechange', Temasys.WebRTCPlugin.injectPlugin, false);
    // document.onreadystatechange = Temasys.WebRTCPlugin.injectPlugin;
    Temasys.WebRTCPlugin.injectPlugin();
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

  Temasys.WebRTCPlugin.pluginNeededButNotInstalledCb = function() {
    document.addEventListener('readystatechange', Temasys.WebRTCPlugin.pluginNeededButNotInstalledCbPriv, false);
    Temasys.WebRTCPlugin.pluginNeededButNotInstalledCbPriv();
  }

  Temasys.WebRTCPlugin.pluginNeededButNotInstalledCbPriv = function () {
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

  Temasys.WebRTCPlugin.renderNotificationBar = function (text, buttonText, buttonLink) {
    // only inject once the page is ready
    if (document.readyState !== 'complete')
      return;

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
}
