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

class RTCRtpReceiver {
  constructor(receiver) {
    pluginManager.WaitForPluginReady();

    this.receiver_ = receiver;
  }

  // ==== PUBLIC FUNCTIONS
  getParameters() {
    return this.receiver_.getParameters();
  };
  getStats() {
    var this_ = this;
    return new Promise((resolve, reject) => {
      var parseAndResolve = (stats) => { resolve(JSON.parse(stats)); };
      this_.receiver_.getStats(parseAndResolve, reject);
    });
  }
  getContributingSources() {
    return this.receiver_.getContributingSources();
  };
  getSynchronizationSources() {
    return this.receiver_.getSynchronizationSources();
  };

  // ==== READ ONLY PROPERTIES

  get track()           { return this.receiver_.track; };
  get transport()       { console.error('RTCRtpReceiver.transport is not supported'); };
  get rtcpTransport()   { console.error('RTCRtpReceiver.rtcpTransport is not supported'); };


  // ==== STATIC FUNCTIONS

  static getCapabilities(kind) {
    if (kind !== 'audio' 
      && kind !== 'video') {
      console.error("RTCRtpReceiver.getCapabilities arg0 should be 'audio', or 'video'");
      return;
    }
    RTCRtpReceiverAdapter.WaitForPluginReady();
    return pluginManager.plugin().GetRtpReceiverCapabilities(kind);
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

export function shimRTCRtpReceiver(window, pm) {
  pluginManager = pm;

  window.RTCRtpReceiver = RTCRtpReceiver;
}
