//mocha.bail();
//mocha.run();

var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;

// Test timeouts
var testTimeout = 35000;

// Get User Media timeout
var gUMTimeout = 25000;

// Test item timeout
var testItemTimeout = 4000;


describe('RTCPeerConnection | EventHandler', function() {
  this.timeout(testTimeout);

  /* Attributes */
  var stream = null;
  var peer1 = null;
  var peer2 = null;


  /* WebRTC Object should be initialized in Safari/IE Plugin */
  before(function (done) {
    this.timeout(testItemTimeout);

    if (window.webrtcDetectedBrowser !== 'IE' && window.webrtcDetectedBrowser !== 'Safari') {
      AdapterJS.onwebrtcreadyDone = true;
    }

    if (!AdapterJS.onwebrtcreadyDone) {
      AdapterJS.onwebrtcready = function () {
        done();
      };

    } else {
      done();
    }
  });

  /* Get User Media */
  beforeEach(function (done) {
    this.slow(1000);
    this.timeout(gUMTimeout + 1000);

    window.navigator.getUserMedia({
      audio: true,
      video: true

    }, function (data) {
      stream = data;

      peer1 = new RTCPeerConnection({ iceServers: [] });
      peer2 = new RTCPeerConnection({ iceServers: [] });

      done();

    }, function (error) {
      throw error;
    });
  });


  it('RTCPeerConnection.onnegotiationneeded :: emit < When > RTCPeerConnection.addStream(stream)', function () {
    this.timeout(testItemTimeout);

    peer1.onnegotiationneeded = function () {
      done();
    };

    peer1.addStream(stream);
  });

  it('RTCPeerConnection.onnegotiationneeded :: emit < When > RTCPeerConnection.removeStream(stream)', function () {
    this.timeout(testItemTimeout);

    peer1.onnegotiationneeded = function () {
      done();
    };

    peer1.removeStream(stream);
  });

  it('RTCPeerConnection.onicecandidate :: emit', function (done) {
    this.timeout(testItemTimeout);

    var peer1IceGathered = false;
    var peer2IceGathered = false;

    peer1.onicecandidate = function () {
      var candidate = event.candidate || event;

      if (candiate.candiate === null) {
        peer1IceGathered = true;
      } else {
        peer2.addIceCandidate(candidate, function () {}, function (error) {
          throw error;
        });
      }
    };

    peer2.onicecandidate = function () {
      var candidate = event.candidate || event;

      if (candiate.candiate === null) {
        peer2IceGathered = true;
      } else {
        peer1.addIceCandidate(candidate, function () {}, function (error) {
          throw error;
        });
      }
    };

    connect(peer1, peer2, function () {
      expect(peer1IceGathered).to.equal(true);
      expect(peer2IceGathered).to.equal(true);
      done();
    });
  });

  it('RTCPeerConnection.onsignalingstatechange :: emit', function (done) {
    this.timeout(testItemTimeout);

    var array1 = [];
    var array2 = [];

    peer1.onsignalingstatechange = function () {
      array1.push(peer1.signalingState);
    };

    peer2.onsignalingstatechange = function () {
      array2.push(peer2.signalingState);
    };

    connect(peer1, peer2, function () {
      expect(array1).to.equal(['have-local-offer', 'stable']);
      expect(array2).to.equal(['have-remote-offer', 'stable']);
      done();
    });
  });

  it('RTCPeerConnection.onaddstream :: emit', function (done) {
    this.timeout(testItemTimeout);

    var remoteStream1 = null;
    var remoteStream2 = null;

    peer1.onaddstream = function (event) {
      remoteStream1 = event.stream || event;
    };

    peer2.onaddstream = function () {
      remoteStream2 = event.stream || event;
    };

    connect(peer1, peer2, function () {
      expect(remoteStream1.getAudioTracks()).to.have.length(stream.getAudioTracks().length);
      expect(remoteStream2.getAudioTracks()).to.have.length(stream.getAudioTracks().length);
      expect(remoteStream1.getVideoTracks()).to.have.length(stream.getVideoTracks().length);
      expect(remoteStream2.getVideoTracks()).to.have.length(stream.getVideoTracks().length);
      done();
    });
  });

  it('RTCPeerConnection.onaddstream :: emit', function (done) {
    this.timeout(testItemTimeout);

    var hasRemovedStream1 = false;
    var hasRemovedStream2 = false;

    peer1.onicecandidate = function () {
      var candidate = event.candidate || event;

      if (candiate.candiate !== null) {
        peer2.addIceCandidate(candidate);
      }
    };

    peer2.onicecandidate = function () {
      var candidate = event.candidate || event;

      if (candiate.candiate !== null) {
        peer1.addIceCandidate(candidate);
      }
    };

    peer1.onremovestream = function () {
      hasRemovedStream1 = true;
    };

    peer2.onremovestream = function () {
      hasRemovedStream2 = true;
    };

    connect(peer1, peer2, function () {

      peer1.removeStream(stream);
      peer2.removeStream(stream);

      connect(peer1, peer2, function () {
        expect(hasRemovedStream1).to.equal(true);
        expect(hasRemovedStream2).to.equal(true);
        expect(peer1.getRemoteStreams()).to.have.length(0);
        expect(peer2.getRemoteStreams()).to.have.length(0);
        done();
      });
    });
  });

  it('RTCPeerConnection.oniceconnectionstatechange :: emit', function (done) {
    this.timeout(testItemTimeout);

    var array1 = [];
    var array2 = [];

    peer1.oniceconnectionstatechange = function () {
      array1.push(peer1.iceConnectionState);
    };

    peer2.oniceconnectionstatechange = function () {
      array2.push(peer2.iceConnectionState);
    };

    connect(peer1, peer2, function () {
      expect(array1).to.equal(['checking', 'connected', 'completed', 'closed']);
      expect(array2).to.equal(['checking', 'connected', 'completed', 'closed']);
      done();
    });
  });

  it('RTCPeerConnection.onicegatheringstatechange :: emit', function (done) {
    this.timeout(testItemTimeout);

    var array1 = [];
    var array2 = [];

    var hasGatheringCompleted1 = false;
    var hasGatheringCompleted2 = false;

    peer1.onicecandidate = function () {
      var candidate = event.candidate || event;

      if (candiate.candiate === null) {
        hasGatheringCompleted1 = array1.indexOf('complete') === array1.length - 1;
      } else {
        peer2.addIceCandidate(candidate);
      }
    };

    peer2.onicecandidate = function () {
      var candidate = event.candidate || event;

      if (candiate.candiate === null) {
        hasGatheringCompleted2 = array2.indexOf('complete') === array2.length - 1;
      } else {
        peer1.addIceCandidate(candidate);
      }
    };

    peer1.onicegatheringstatechange = function () {
      array1.push(peer1.iceGatheringState);
    };

    peer2.onicegatheringstatechange = function () {
      array2.push(peer2.iceGatheringState);
    };

    connect(peer1, peer2, function () {
      expect(hasGatheringCompleted1).to.equal(true);
      expect(hasGatheringCompleted2).to.equal(true);
      expect(array1).to.equal(['new', 'gathering', 'complete']);
      expect(array2).to.equal(['new', 'gathering', 'complete']);
      done();
    });
  });
});