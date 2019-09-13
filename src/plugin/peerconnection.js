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

class RTCPeerConnectionAdapter {
  constructor(configuration) {
    // Note : this line waits for the plugin to be ready
    // This means that RTCPeerConnectionAdapter's functinos don't need to be protected for plugin ready
    pluginManager.WaitForPluginReady();

    this.pc_ = pluginManager.plugin().PeerConnection(configuration);

    // Event forwarding
    this.forwardEvent(this.pc_, 'onicecandidate');
    this.forwardEvent(this.pc_, 'onaddstream');
    this.forwardEvent(this.pc_, 'ontrack');
    this.forwardEvent(this.pc_, 'onsignalingstatechange');
    this.forwardEvent(this.pc_, 'oniceconnectionstatechange');
    this.forwardEvent(this.pc_, 'ongatheringchange');
    this.forwardEvent(this.pc_, 'onnegotiationneeded');
    this.forwardEvent(this.pc_, 'ondatachannel');
    this.forwardEvent(this.pc_, 'onremovestream');
  };

  // ==== PUBLIC FUNCTIONS

  createDataChannel(label, dataChannelDict) {
    return this.pc_.createDataChannel(label, dataChannelDict);
  };
  createDTMFSender(audioTrack) {
    return this.pc_.createDTMFSender(audioTrack);
  };
  createOffer(constraints) {
    var this_ = this;
    return new Promise(function(resolve, reject) {
      this_.pc_.createOffer(resolve, reject, constraints);
    });
  };
  createAnswer(constraints) {
    var this_ = this;
    return new Promise(function(resolve, reject) {
      this_.pc_.createAnswer(resolve, reject, constraints);
    });
  };
  setLocalDescription(description) {
    var this_ = this;
    return new Promise(function(resolve, reject) {
      this_.pc_.setLocalDescription(description, resolve, reject);
    });
  };
  setRemoteDescription(description) {
    var this_ = this;
    return new Promise(function(resolve, reject) {
      this_.pc_.setRemoteDescription(description, resolve, reject);
    });
  };
  addIceCandidate(candidate) {
    var this_ = this;
    return new Promise(function(resolve, reject) {
      this_.pc_.addIceCandidate(candidate, resolve, reject);
    });
  };
  addStream(stream) {
    return this.pc_.addStream(stream);
  };
  removeStream(stream) {
    return this.pc_.removeStream(stream);
  };
  addTrack(track, stream) {
    return this.pc_.addTrack(track, stream);
  };
  getLocalStreams() { // Depreacted
    console.warn('getLocalStreams is depreacted.');
    return this.pc_.getLocalStreams();
  };
  getRemoteStreams() { // Depreacted
    console.warn('getRemoteStreams is depreacted.');
    return this.pc_.getRemoteStreams();
  };
  getStats(optTrack) {
    optTrack = typeof(optTrack) !== 'undefined' ? optTrack : null;
    var this_ = this;
    return new Promise(function(resolve, reject) {
      this_.pc_.getStats(optTrack, resolve, reject);
    });
  };
  close() {
    return this.pc_.close();
  };

  // ==== READ ONLY PROPERTIES
  get localDescription()    { return this.pc_.localDescription;   };
  get remoteDescription()   { return this.pc_.remoteDescription;  };
  get signalingState()      { return this.pc_.signalingState;     };
  get iceConnectionState()  { return this.pc_.iceConnectionState; };
  get iceGatheringState()   { return this.pc_.iceGatheringState;  };

  // get testStr() {
  //   return this.pc_.testStr;
  // }
  // set testStr(str) {
  //   this.pc_.testStr = str;
  // }

  // MISSING
  // addTrack() {
  // removeTrack() {
  // readonly attribute RTCSessionDescription? currentLocalDescription;
  // readonly attribute RTCSessionDescription? pendingLocalDescription;
  // readonly attribute boolean?               canTrickleIceCandidates;
  // readonly attribute RTCSessionDescription? currentRemoteDescription;
  // readonly attribute RTCSessionDescription? pendingRemoteDescription;

  // ==== PRIVATE
  WaitForPluginReady() {
    pluginManager.WaitForPluginReady();
  };

  // TODO: move me to utils ??
  forwardEvent(eventProducer, eventName) {
    eventProducer[eventName] = function(e) {
      if (typeof this[eventName] === 'function') 
        this[eventName](e);
    }.bind(this);
  };
}


////////////////////////////////////////////////////////////////////////////
/// 
/// exports
/// 
////////////////////////////////////////////////////////////////////////////


export function shimPeerConnection(window, pm) {
  pluginManager = pm;

  window.RTCPeerConnection = RTCPeerConnectionAdapter;

  ////////////////////////////////////////////////////////////////////////////
  /// RTCIceCandidate TODO: give me my own file
  ////////////////////////////////////////////////////////////////////////////
  window.RTCIceCandidate = function (candidate) {
    if (!candidate.sdpMid) {
      candidate.sdpMid = '';
    }

    pluginManager.WaitForPluginReady();
    return pluginManager.plugin().ConstructIceCandidate(
      candidate.sdpMid, candidate.sdpMLineIndex, candidate.candidate
    );
  };
}
