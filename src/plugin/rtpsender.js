'use strict';

////////////////////////////////////////////////////////////////////////////
/// 
/// local variables
/// 
////////////////////////////////////////////////////////////////////////////

let pluginManager = null;

////////////////////////////////////////////////////////////////////////////
/// 
/// Internal functions
/// 
////////////////////////////////////////////////////////////////////////////

class RTCRtpSender {
  constructor(sender) {
    pluginManager.WaitForPluginReady();

    this.sender_ = sender;
  }

  // ==== PUBLIC FUNCTIONS

  getParameters() {
    return this.sender_.getParameters();
  };
  setParameters(parameters) {
    var this_ = this;
    return new Promise((resolve, reject) => {
      this_.sender_.setParameters(parameters, resolve, reject);
    });    
  };
  replaceTrack(track) {
    var this_ = this;
    return new Promise((resolve, reject) => {
      this_.sender_.setTrack(track, resolve, reject);
    });
  };
  setStreams(streams) {
    console.error('RTCRtpSender.setStream is not supported');
  };
  getStats() {
    var this_ = this;
    return new Promise((resolve, reject) => {
      var parseAndResolve = (stats) => {
        resolve(stats ? JSON.parse(stats) : []);
      };
      this_.sender_.getStats(parseAndResolve, reject);
    });
  }

  // ==== READ ONLY PROPERTIES

  get track()           { return this.sender_.track; };
  get transport()       { console.error('RTCRtpSender.transport is not supported'); };
  get rtcpTransport()   { console.error('RTCRtpSender.rtcpTransport is not supported'); };
  get dtmf()            { console.error('RTCRtpSender.dtmf is not supported'); };

  // ==== STATIC FUNCTIONS

  static getCapabilities(kind) {
    if (kind !== 'audio' 
      && kind !== 'video') {
      console.error("RTCRtpSender.getCapabilities arg0 should be 'audio', or 'video'");
      return;
    }
    RTCRtpSenderAdapter.WaitForPluginReady();
    return pluginManager.plugin().GetRtpSenderCapabilities(kind);
  };

  // ==== PRIVATE
  static WaitForPluginReady() {
    pluginManager.WaitForPluginReady();
  };
}

////////////////////////////////////////////////////////////////////////////
/// 
/// exports
/// 
////////////////////////////////////////////////////////////////////////////

export function shimRTCRtpSender(window, pm) {
  pluginManager = pm;

  window.RTCRtpSender = RTCRtpSender;
}
