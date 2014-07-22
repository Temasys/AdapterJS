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