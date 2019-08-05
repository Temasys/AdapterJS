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
    // TODO: can JS do pre-processor-like functions ? If not maybe some string to function tool ?
    this.pc_.onicecandidate = this._onicecandidate.bind(this);
    this.pc_.onaddstream = this._onaddstream.bind(this);
    this.pc_.onsignalingstatechange = this._onsignalingstatechange.bind(this);
    this.pc_.oniceconnectionstatechange = this._oniceconnectionstatechange.bind(this);
    this.pc_.ongatheringchange = this._ongatheringchange.bind(this);
    this.pc_.onnegotiationneeded = this._onnegotiationneeded.bind(this);
    this.pc_.onicecandidate = this._onicecandidate.bind(this);
    this.pc_.ondatachannel = this._ondatachannel.bind(this);
    this.pc_.onremovestream = this._onremovestream.bind(this);
  }

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

  // ==== EVENT CONNECTORS
  _onicecandidate(e) {
    if (typeof this.onicecandidate === 'function') this.onicecandidate(e);
  };

  _onaddstream(e) {
    if (typeof this.onaddstream === 'function') this.onaddstream(e);
  };
  _onsignalingstatechange(e) {
    if (typeof this.onsignalingstatechange === 'function') this.onsignalingstatechange(e);
  };
  _oniceconnectionstatechange(e) {
    if (typeof this.oniceconnectionstatechange === 'function') this.oniceconnectionstatechange(e);
  };
  _ongatheringchange(e) {
    if (typeof this.ongatheringchange === 'function') this.ongatheringchange(e);
  };
  _onnegotiationneeded(e) {
    if (typeof this.onnegotiationneeded === 'function') this.onnegotiationneeded(e);
  };
  _onicecandidate(e) {
    if (typeof this.onicecandidate === 'function') this.onicecandidate(e);
  };
  _ondatachannel(e) {
    if (typeof this.ondatachannel === 'function') this.ondatachannel(e);
  };
  _onremovestream(e) {
    if (typeof this.onremovestream === 'function') this.onremovestream(e);
  };


  // get testStr() {
  //   return this.pc_.testStr;
  // }
  // set testStr(str) {
  //   this.pc_.testStr = str;
  // }

  // MISSING
  // addTrack() {
  // removeTrack() {
  // getLocalStreams() {
  // getRemoteStreams() {
  // readonly attribute RTCSessionDescription? currentLocalDescription;
  // readonly attribute RTCSessionDescription? pendingLocalDescription;
  // readonly attribute boolean?               canTrickleIceCandidates;
  // readonly attribute RTCSessionDescription? currentRemoteDescription;
  // readonly attribute RTCSessionDescription? pendingRemoteDescription;


  // ==== PRIVATE
  WaitForPluginReady() {
    pluginManager.WaitForPluginReady();
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
