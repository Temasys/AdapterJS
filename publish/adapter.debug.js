/*! adapterjs - v0.0.2 - 2014-07-22 */

/**
 * Add-on classes to help interopability that is not from the original AdapterJS specification
 *
 * @class AdapterJS
 */
(function () {
  /**
   * @class AdapterJS
   * @constructor
  */
  function IAdapterJS () {
    /**
     * Note:
     *   The results of each states returns
     * @attribute _ICECONNECTION_STATE
     * @type JSON
     * @protected
     */
    this.PLUGIN_READY_STATE = {
      INIT : 0,
      READY : 1
    };
    /**
     * Note:
     *   The results of each states returns
     * @attribute _ICECONNECTION_STATE
     * @type JSON
     * @private
     */
    this._ICECONNECTION_STATE = {
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
     * @attribute ICEConnectionFiredStates
     * @type JSON
     */
    this.ICEConnectionFiredStates = {};
    /**
     * Note:
     *  The WebRTC Detected type information
     * @attribute browser
     * @type JSON
     */
    this.browser = {};
    /**
     * State of Plugin ready [Rel: AdapterJS.PLUGIN_READY_STATE]
     *
     * @attribute pluginReadyState
     * @type String
     * - INIT: Plugin is loading.
     * - READY: Plugin has been loaded and is ready to use
     */
    this.pluginReadyState = this.PLUGIN_READY_STATE.INIT;
  }
  this.IAdapterJS = IAdapterJS;

  /**
   * Note:
   *   Handles the differences for all Browsers
   *
   * @method checkIceConnectionState
   * @param {String} peerID
   * @param {String} iceConnectionState
   * @param {Function} callback
   * @param {Boolean} returnStateAlways
   * @protected
   */
  IAdapterJS.prototype.checkIceConnectionState =
    function (peerID, iceConnectionState, callback, returnStateAlways) {
    if (typeof callback !== 'function') {
      return;
    }
    peerID = (peerID) ? peerID : 'peer';
    var returnState = false, err = null;
    console.log('ICECONNECTIONSTATE: ' + iceConnectionState);

    if (!this.ICEConnectionFiredStates[peerID] ||
      iceConnectionState === this._ICECONNECTION_STATE.DISCONNECTED ||
      iceConnectionState === this._ICECONNECTION_STATE.FAILED ||
      iceConnectionState === this._ICECONNECTION_STATE.CLOSED) {
      this.ICEConnectionFiredStates[peerID] = [];
    }
    iceConnectionState = this._ICECONNECTION_STATE[iceConnectionState];
    if (this.ICEConnectionFiredStates[peerID].indexOf(iceConnectionState) === -1) {
      this.ICEConnectionFiredStates[peerID].push(iceConnectionState);
      if (iceConnectionState === this._ICECONNECTION_STATE.CONNECTED) {
        setTimeout(function () {
          this.ICEConnectionFiredStates[peerID].push(this._ICECONNECTION_STATE.DONE);
          callback(this._ICECONNECTION_STATE.DONE);
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
   * @method _getBrowser
   * @private
   */
  IAdapterJS.prototype._getBrowser = function () {
    var agent = {},
    na = navigator,
    ua = na.userAgent,
    tem;
    var M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

    if (na.mozGetUserMedia) {
      agent.mozWebRTC = true;
    } else if (na.webkitGetUserMedia) {
      agent.webkitWebRTC = true;
    } else {
      if (ua.indexOf('Safari')) {
        if (typeof InstallTrigger !== 'undefined') {
          agent.browser = 'Firefox';
        } else if (/*@cc_on!@*/
          false || !!document.documentMode) {
          agent.browser = 'IE';
        } else if (
          Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0) {
          agent.browser = 'Safari';
        } else if (!!window.opera || na.userAgent.indexOf(' OPR/') >= 0) {
          agent.browser = 'Opera';
        } else if (!!window.chrome) {
          agent.browser = 'Chrome';
        }
        agent.pluginWebRTC = true;
      }
    }
    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
      agent.browser = 'IE';
      agent.version = parseInt(tem[1] || '0', 10);
    } else if (M[1] === 'Chrome') {
      tem = ua.match(/\bOPR\/(\d+)/);
      if (tem !== null) {
        agent.browser = 'Opera';
        agent.version = parseInt(tem[1], 10);
      }
    }
    if (!agent.browser) {
      agent.browser = M[1];
    }
    if (!agent.version) {
      try {
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) !== null) {
          M.splice(1, 1, tem[1]);
        }
        agent.version = parseInt(M[1], 10);
      } catch (err) {
        agent.version = 0;
      }
    }
    agent.os = navigator.platform;
    agent.isSCTPDCSupported = agent.mozWebRTC ||
      (agent.browser === 'Chrome' && agent.version > 30) ||
      (agent.browser === 'Opera' && agent.version > 19);
    agent.isRTPDCSupported = agent.browser === 'Chrome' && agent.version < 30 && agent.version > 24;
    agent.isPluginSupported = !agent.isSCTPDCSupported && !agent.isRTPDCSupported;
    return agent;
  };

  /**
   * Set the settings for creating DataChannels, MediaStream for Cross-browser compability.
   * This is only for SCTP based support browsers
   *
   * @method checkMediaDataChannelSettings
   * @param {Boolean} isOffer
   * @param {String} peerBrowserAgent
   * @param {Function} callback
   * @param {JSON} constraints
   * @protected
   */
  IAdapterJS.prototype.checkMediaDataChannelSettings =
    function (isOffer, peerBrowserAgent, callback, constraints) {
    if (typeof callback !== 'function') {
      return;
    }
    var peerBrowserVersion, beOfferer = false;

    console.log('Self: ' + this.browser.browser + ' | Peer: ' + peerBrowserAgent);

    if (peerBrowserAgent.indexOf('|') > -1) {
      peerBrowser = peerBrowserAgent.split('|');
      peerBrowserAgent = peerBrowser[0];
      peerBrowserVersion = parseInt(peerBrowser[1], 10);
      console.info('Peer Browser version: ' + peerBrowserVersion);
    }
    var isLocalFirefox = this.browser.mozWebRTC;
    // Nightly version does not require MozDontOfferDataChannel for interop
    var isLocalFirefoxInterop = this.browser.mozWebRTC && this.browser.version > 30;
    var isPeerFirefox = peerBrowserAgent === 'Firefox';
    var isPeerFirefoxInterop = peerBrowserAgent === 'Firefox' &&
      ((peerBrowserVersion) ? (peerBrowserVersion > 30) : false);

    // Resends an updated version of constraints for MozDataChannel to work
    // If other userAgent is firefox and user is firefox, remove MozDataChannel
    if (isOffer) {
      if ((isLocalFirefox && isPeerFirefox) || (isLocalFirefoxInterop)) {
        try {
          delete constraints.mandatory.MozDontOfferDataChannel;
        } catch (err) {
          console.error('Failed deleting MozDontOfferDataChannel');
          console.exception(err);
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
   * Check the availability of the MediaStream and DataChannel.
   * Method to be called after getUserMedia
   *
   * @method checkMediaDataChannel
   * @param {MediaStream} stream
   * @param {JSON} constraints
   * @protected
   */
  IAdapterJS.prototype.checkMediaDataChannel = function (stream, constraints) {
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
    } catch (err) {
      console.error('Failed creating DataChannel');
      console.error(err);
    }
    return testedOptions;
  };
}).call(this);
AdapterJS = new IAdapterJS();
AdapterJS.browser = AdapterJS._getBrowser();
//-----------------------------------------------------------
// Temasys Implemented functions
//-----------------------------------------------------------
/**
 * Temasys reserved namespace
 *
 * @namespace Temasys
 * @type JSON
 * @requires Temasys Plugin. Please download it from
 *   https://temasys.atlassian.net/wiki/display/TWPP/WebRTC+Plugins
 */
var Temasys = Temasys || {};
/**
 * Temasys WebRTC plugin reserved namespace
 *
 * @attribute WebRTCPlugin
 * @type JSON
 */
Temasys.WebRTCPlugin = Temasys.WebRTCPlugin || {};
/**
 * This function detects whether or not a plugin is installed
 * - Com name : the company name,
 * - plugName : the plugin name
 * - installedCb : callback if the plugin is detected (no argument)
 * - notInstalledCb : callback if the plugin is not detected (no argument)
 *
 * @method isPluginInstalled
 * @protected
 */
Temasys.WebRTCPlugin.isPluginInstalled = null;
/**
 * Defines webrtc's JS interface according to the plugin's implementation
 *
 * @attribute defineWebRTCInterface
 * @type Function
 */
Temasys.WebRTCPlugin.defineWebRTCInterface = null;
/**
 * This function will be called if the plugin is needed
 * (browser different from Chrome or Firefox),
 * but the plugin is not installed
 * Override it according to your application logic.
 *
 * @method pluginNeededButNotInstalledCb
 * @protected
 */
Temasys.WebRTCPlugin.pluginNeededButNotInstalledCb = null;
/**
 * The Object to store Plugin information
 *
 * @attribute temPluginInfo
 * @type JSON
 */
Temasys.WebRTCPlugin.temPluginInfo = {
  pluginId : 'plugin0',
  type : 'application/x-temwebrtcplugin',
  onload : '__TemWebRTCReady0'
};
/**
 * Unique identifier of each opened page
 *
 * @attribute TemPageId
 * @type String
 */
Temasys.WebRTCPlugin.TemPageId = Math.random().toString(36).slice(2);
/**
 * Use this whenever you want to call the plugin
 *
 * @attribute plugin
 * @type DOM Object
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
 *
 * @method TemPrivateWebRTCReadyCb
 * @private
 * @beta
 */
/*Temasys.WebRTCPlugin.TemPrivateWebRTCReadyCb = function () {
   arguments.callee.StaticWasInit = arguments.callee.StaticWasInit || 1;
   if (arguments.callee.StaticWasInit === 1) {
     if (typeof WebRTCReadyCb === 'function') {
       WebRTCReadyCb();
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
 *
 * @method TemInitPlugin0
 * @protected
 */
__TemWebRTCReady0 = function () {
  arguments.callee.StaticWasInit = arguments.callee.StaticWasInit || 1;
  if (arguments.callee.StaticWasInit === 1) {
    Temasys.isPluginReady = true;
    if (typeof WebRTCReadyCb === 'function') {
      WebRTCReadyCb();
    }
  }
  arguments.callee.StaticWasInit++;
};
/**
 * Called when Plugin is ready to use
 *
 * @method WebRTCReadyCb
 * @protected
 */
WebRTCReadyCb = function () {
  AdapterJS.pluginReadyState = AdapterJS.PLUGIN_READY_STATE.READY;
};
/**
 * To Fix Configuration as some browsers,
 * some browsers does not support the 'urls' attribute
 * - .urls is not supported in FF yet.
 *
 * @attribute maybeFixConfiguration
 * @type Function
 * @param {JSON} pcConfig
 * @private
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
//-----------------------------------------------------------
// AdapterJS functions from original Google Code
//-----------------------------------------------------------
/**
 * Note:
 *  The RTCPeerConnection object.
 * [attribute] RTCPeerConnection
 * [type] Function
 */
RTCPeerConnection = null;
/**
 * Note:
 *  Get UserMedia (only difference is the prefix).
 * [Credits] Code from Adam Barth.
 *
 * [attribute] RTCIceCandidate
 * [type] Function
 */
getUserMedia = null;
/**
 * Note:
 *  Attach a media stream to an element.
 *
 * [attribute] attachMediaStream
 * [type] Function
 */
attachMediaStream = null;
/**
 * Note:
 *  Re-attach a media stream to an element.
 *
 * [attribute] reattachMediaStream
 * [type] Function
 */
reattachMediaStream = null;
/*******************************************************************
 Check for browser types and react accordingly
*******************************************************************/
if (AdapterJS.browser.mozWebRTC) {
  /**
   * Note:
   *  Creates a RTCPeerConnection object for moz
   *
   * [method] RTCPeerConnection
   * [param] {JSON} pcConfig
   * [param] {JSON} pcConstraints
   */
  RTCPeerConnection = function (pcConfig, pcConstraints) {
    maybeFixConfiguration(pcConfig);
    return new mozRTCPeerConnection(pcConfig, pcConstraints);
  };

  RTCSessionDescription = mozRTCSessionDescription;
  RTCIceCandidate = mozRTCIceCandidate;
  getUserMedia = navigator.mozGetUserMedia.bind(navigator);
  navigator.getUserMedia = getUserMedia;

  /**
   * Note:
   *   Creates iceServer from the url for Firefox.
   *  - Create iceServer with stun url.
   *  - Create iceServer with turn url.
   *    - Ignore the transport parameter from TURN url for FF version <=27.
   *    - Return null for createIceServer if transport=tcp.
   *  - FF 27 and above supports transport parameters in TURN url,
   *    - So passing in the full url to create iceServer.
   *
   * [method] createIceServer
   * [param] {String} url
   * [param] {String} username
   * [param] {String} password
   */
  createIceServer = function (url, username, password) {
    var iceServer = null;
    var url_parts = url.split(':');
    if (url_parts[0].indexOf('stun') === 0) {
      iceServer = { 'url' : url };
    } else if (url_parts[0].indexOf('turn') === 0) {
      if (AdapterJS.browser.version < 27) {
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

  /**
   * Note:
   *  Creates IceServers for Firefox
   *  - Use .url for FireFox.
   *  - Multiple Urls support
   *
   * [method] createIceServers
   * [param] {JSON} pcConfig
   * [param] {JSON} pcConstraints
   */
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

  /**
   * Note:
   *  Attach Media Stream for moz
   *
   * [method] attachMediaStream
   * [param] {HTMLVideoDOM} element
   * [param] {Blob} Stream
   */
  attachMediaStream = function (element, stream) {
    console.log('Attaching media stream');
    element.mozSrcObject = stream;
    element.play();
    return element;
  };

  /**
   * Note:
   *  Re-attach Media Stream for moz
   *
   * [method] attachMediaStream
   * [param] {HTMLVideoDOM} to
   * [param] {HTMLVideoDOM} from
   */
  reattachMediaStream = function (to, from) {
    console.log('Reattaching media stream');
    to.mozSrcObject = from.mozSrcObject;
    to.play();
    return to;
  };

  /*******************************************************
   Fake get{Video,Audio}Tracks
  ********************************************************/
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
} else if (AdapterJS.browser.webkitWebRTC) {
  /**
   * Note:
   *  Creates iceServer from the url for Chrome M33 and earlier.
   *  - Create iceServer with stun url.
   *  - Chrome M28 & above uses below TURN format.
   *
   * [method] createIceServer
   * [param] {String} url
   * [param] {String} username
   * [param] {String} password
   */
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

   /**
   * Note:
   *   Creates iceServers from the urls for Chrome M34 and above.
   *  - .urls is supported since Chrome M34.
   *  - Multiple Urls support
   *
   * [method] createIceServers
   * [param] {Array} urls
   * [param] {String} username
   * [param] {String} password
   */
  createIceServers = function (urls, username, password) {
    var iceServers = [];
    if (AdapterJS.browser.version >= 34) {
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

  /**
   * Note:
   *  Creates an RTCPeerConection Object for webkit
   * - .urls is supported since Chrome M34.
   * [method] RTCPeerConnection
   * [param] {String} url
   * [param] {String} username
   * [param] {String} password
   */
  RTCPeerConnection = function (pcConfig, pcConstraints) {
    if (AdapterJS.browser.version < 34) {
      maybeFixConfiguration(pcConfig);
    }
    return new webkitRTCPeerConnection(pcConfig, pcConstraints);
  };

  getUserMedia = navigator.webkitGetUserMedia.bind(navigator);
  navigator.getUserMedia = getUserMedia;

  /**
   * Note:
   *  Attach Media Stream for webkit
   *
   * [method] attachMediaStream
   * [param] {HTMLVideoDOM} element
   * [param] {Blob} Stream
   */
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

  /**
   * Note:
   *  Re-attach Media Stream for webkit
   *
   * [method] attachMediaStream
   * [param] {HTMLVideoDOM} to
   * [param] {HTMLVideoDOM} from
   */
  reattachMediaStream = function (to, from) {
    to.src = from.src;
    return to;
  };
  __TemWebRTCReady0();
} else if (AdapterJS.browser.pluginWebRTC) {
  // var isOpera = AdapterJS.browser.browser === 'Opera'; // Might not be used.
  var isFirefox = AdapterJS.browser.browser === 'Firefox';
  var isSafari = AdapterJS.browser.browser === 'Safari';
  var isChrome = AdapterJS.browser.browser === 'Chrome';
  var isIE = AdapterJS.browser.browser === 'IE';

  /********************************************************************************
    Load Plugin
  ********************************************************************************/
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
    document.getElementsByTagName('body')[0].appendChild(Temasys.WebRTCPlugin.TemRTCPlugin);
  }

  // FIXEM: dead code?
  Temasys.WebRTCPlugin.TemRTCPlugin.onreadystatechange = function (state) {
    console.log('Plugin: Ready State : ' + state);
    if (state === 4) {
      console.log('Plugin has been loaded');
    }
  };

  /**
   * Note:
   *   Checks if the Plugin is installed
   *  - Check If Not IE (firefox, for example)
   *  - Else If it's IE - we're running IE and do something
   *  - Else Unsupported
   *
   * [method] isPluginInstalled
   * [param] {String} comName
   * [param] {String} plugName
   * [param] {Function} installedCb
   * [param] {Function} notInstalledCb
   */
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

  /**
   * Note:
   *   Define Plugin Browsers as WebRTC Interface
   *
   * [method] defineWebRTCInterface
   */
  Temasys.WebRTCPlugin.defineWebRTCInterface = function () {
    /**
    * Note:
    *   Check if WebRTC Interface is Defined
    * - This is a Util Function
    *
    * [method] isDefined
    * [param] {String} variable
    */
    Temasys.WebRTCPlugin.isDefined = function (variable) {
      return variable !== null && variable !== undefined;
    };

    /**
    * Note:
    *   Creates Ice Server for Plugin Browsers
    * - If Stun - Create iceServer with stun url.
    * - Else - Create iceServer with turn url
    * - This is a WebRTC Function
    *
    * [method] createIceServer
    * [param] {String} url
    * [param] {String} username
    * [param] {String} password
    */
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

    /**
    * Note:
    *   Creates Ice Servers for Plugin Browsers
    * - Multiple Urls support
    * - This is a WebRTC Function
    *
    * [method] createIceServers
    * [param] {Array} urls
    * [param] {String} username
    * [param] {String} password
    */
    createIceServers = function (urls, username, password) {
      var iceServers = [];
      for (var i = 0; i < urls.length; ++i) {
        iceServers.push(createIceServer(urls[i], username, password));
      }
      return iceServers;
    };

    /**
    * Note:
    *   Creates RTCSessionDescription object for Plugin Browsers
    * - This is a WebRTC Function
    *
    * [method] RTCSessionDescription
    * [param] {Array} urls
    * [param] {String} username
    * [param] {String} password
    */
    RTCSessionDescription = function (info) {
      return Temasys.WebRTCPlugin.TemRTCPlugin.ConstructSessionDescription(info.type, info.sdp);
    };

    /**
    * Note:
    *   Creates RTCPeerConnection object for Plugin Browsers
    * - This is a WebRTC Function
    *
    * [method] RTCSessionDescription
    * [param] {JSON} servers
    * [param] {JSON} contstraints
    */
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

    /*******************************************************
     getUserMedia
    ********************************************************/
    getUserMedia = function (constraints, successCallback, failureCallback) {
      if (!constraints.audio) {
        constraints.audio = false;
      }
      Temasys.WebRTCPlugin.TemRTCPlugin.getUserMedia(constraints, successCallback, failureCallback);
    };
    navigator.getUserMedia = getUserMedia;

    /**
     * Note:
     *  Attach Media Stream for Plugin Browsers
     *  - If Check is audio element
     *  - Else The sound was enabled, there is nothing to do here
     *
     * [method] attachMediaStream
     * [param] {HTMLVideoDOM} element
     * [param] {Blob} Stream
     */
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

    /**
     * Note:
     *  Re-attach Media Stream for Plugin Browsers
     *
     * [method] attachMediaStream
     * [param] {HTMLVideoDOM} to
     * [param] {HTMLVideoDOM} from
     */
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
        alert('Could not find the stream associated with this element');
      }
    };

    /**
    * Note:
    *   Creates RTCIceCandidate object for Plugin Browsers
    * - This is a WebRTC Function
    *
    * [method] RTCIceCandidate
    * [param] {JSON} candidate
    */
    RTCIceCandidate = function (candidate) {
      if (!candidate.sdpMid) {
        candidate.sdpMid = '';
      }
      return Temasys.WebRTCPlugin.TemRTCPlugin.ConstructIceCandidate(
        candidate.sdpMid, candidate.sdpMLineIndex, candidate.candidate
      );
    };
  };

  Temasys.WebRTCPlugin.pluginNeededButNotInstalledCb = function () {
    alert('Your browser is not webrtc ready and Temasys plugin is not installed');
  };
  // Try to detect the plugin and act accordingly
  Temasys.WebRTCPlugin.isPluginInstalled('Tem', 'TemWebRTCPlugin',
    Temasys.WebRTCPlugin.defineWebRTCInterface,
    Temasys.WebRTCPlugin.pluginNeededButNotInstalledCb);
} else {
  console.log('Browser does not appear to be WebRTC-capable');
}