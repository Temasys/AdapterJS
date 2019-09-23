'use strict';

////////////////////////////////////////////////////////////////////////////
//
// /!\ IMPORTANT
// RTCRtpTransceiver, RTCRtpSender, and RTCRtpReceiver wrappers MUST remain 
// stateless. They can be multiple wrappers around the same actual object
// They can only forward calls to the plugin implementation
// 
////////////////////////////////////////////////////////////////////////////

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

class RTCRtpTransceiver {
  constructor(transceiver) {
    pluginManager.WaitForPluginReady();

    this.transceiver_ = transceiver;
  }

  // ==== PUBLIC FUNCTIONS

  setCodecPreferences() {
    console.error('RTCRtpTransceiver.setCodecPreferences is not supported');
  };
  stop() {
    return this.transceiver_.stop();
  };

  // ==== READ WRITE PROPERTIES

  get direction()             { return this.transceiver_.direction; };
  set direction(d)            { this.transceiver_.direction = d; };

  // ==== READ ONLY PROPERTIES

  get currentDirection()      { return this.transceiver_.currentDirection; };
  get mid()                   { return this.transceiver_.mid; };
  get receiver()              { return new RTCRtpReceiver(this.transceiver_.receiver); };
  get sender()                { return new RTCRtpSender(this.transceiver_.sender); };
  get stopped()               { return this.transceiver_.stopped; };

  // ==== STATIC FUNCTIONS

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

export function shimRTCRtpTransceiver(window, pm) {
  pluginManager = pm;

  window.RTCRtpTransceiver = RTCRtpTransceiver;
}
