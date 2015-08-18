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

    AdapterJS.webRTCReady(function() {
      done();
    });
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


  it('RTCPeerConnection.onnegotiationneeded :: emit < When > RTCPeerConnection.addStream(stream)', function (done) {
    this.timeout(testItemTimeout);

    peer1.onnegotiationneeded = function () {
      done();
    };

    peer1.addStream(stream);
  });

  it('RTCPeerConnection.onnegotiationneeded :: emit < When > RTCPeerConnection.removeStream(stream)', function (done) {
    this.timeout(testItemTimeout);

    peer1.onnegotiationneeded = function () {
      done();
    };

    peer1.removeStream(stream);
  });

  it('RTCPeerConnection.onicecandidate :: emit', function (done) {
    this.timeout(testItemTimeout);

    var peer1IceCount = 0;
    var peer2IceCount = 0;
    var peer1IceGathered = false;
    var peer2IceGathered = false;

    checkdone = function() {
      if (peer1IceGathered && peer2IceGathered) {
        assert.notEqual(peer1IceCount, 0);
        assert.notEqual(peer2IceCount, 0);
        done();
      }
    };

    peer1.onicecandidate = function () {
      var candidate = event.candidate;

      if (candidate === null) {
        peer1IceGathered = true;
        checkdone();
      } else {
        ++peer1IceCount;
        // TODO(J-O): since we don't test addIceCandidate here, can we remove it ?
        peer2.addIceCandidate(candidate, function () {}, function (error) {
          throw error;
        });
      }
    };

    peer2.onicecandidate = function () {
      var candidate = event.candidate;

      if (candidate === null) {
        peer2IceGathered = true;
        checkdone();
      } else {
        ++peer2IceCount;
        // TODO(J-O): since we don't test addIceCandidate here, can we remove it ?
        peer1.addIceCandidate(candidate, function () {}, function (error) {
          throw error;
        });
      }
    };

    connect(peer1, peer2);
  });

  it('RTCPeerConnection.onsignalingstatechange :: emit', function (done) {
    //TODO(J-O): close connection at the end and check that 'closed' is in the array

    this.timeout(testItemTimeout);

    var array1 = [];
    var array2 = [];

    var checkdone = function() {
      if ( isArrayEqual( array1, ['stable', 'have-local-offer', 'stable'] )
        && isArrayEqual( array2, ['stable', 'have-remote-offer', 'stable'] )) {
        done();
      }
    }

    peer1.onsignalingstatechange = function () {
      array1.push(peer1.signalingState);
      checkdone();
    };

    peer2.onsignalingstatechange = function () {
      array2.push(peer2.signalingState);
      checkdone();
    };

    array1.push(peer1.signalingState);
    array2.push(peer2.signalingState);

    connect(peer1, peer2);
  });

  it('RTCPeerConnection.onaddstream :: emit', function (done) {
    this.timeout(testItemTimeout);

    peer2.onaddstream = function (event) {
      var remoteStream = event.stream;
      expect(remoteStream.getAudioTracks()).to.have.length(stream.getAudioTracks().length);
      expect(remoteStream.getVideoTracks()).to.have.length(stream.getVideoTracks().length);
      done();
    };

    peer1.addStream(stream);

    connect(peer1, peer2);
  });

  it('RTCPeerConnection.onremovestream :: emit', function (done) {
    this.timeout(testItemTimeout);

    peer2.onaddstream = function (event) {
      peer1.removeStream(stream);
      connect(peer1, peer2); // renegociate
    };

    peer2.onremovestream = function () {
      done();
    };

    peer1.addStream(stream);

    connect(peer1, peer2);
  });

  it('RTCPeerConnection.oniceconnectionstatechange :: emit', function (done) {
    //TODO(J-O): close connection at the end and check that 'closed' is in the array

    this.timeout(testItemTimeout);

    var array1 = [];
    var array2 = [];

    var checkdone = function() {
      if ( isArrayEqual( array1, ['new', 'checking', 'completed', 'completed'/*, 'closed'*/] )
        && isArrayEqual( array2, ['new', 'checking', 'connected'/*, 'completed', 'closed'*/] )) {
        done();
      }
    }

    peer1.oniceconnectionstatechange = function () {
      array1.push(peer1.iceConnectionState);
      checkdone();
    };

    peer2.oniceconnectionstatechange = function () {
      array2.push(peer2.iceConnectionState);
      checkdone();
    };

    array1.push(peer1.iceConnectionState);
    array2.push(peer2.iceConnectionState);
    connect(peer1, peer2);
  });

  it('RTCPeerConnection.onicegatheringstatechange :: emit', function (done) {
    // Note(J-O) I'm not sure why this doesn't work

    this.timeout(testItemTimeout);

    var array1 = [];
    var array2 = [];

    var checkdone = function() {
      console.log(array1);
      console.log(array2);

      assert.deepEqual(array1, ['new', 'gathering', 'complete']);
      assert.deepEqual(array2, ['new', 'gathering', 'complete']);

      if ( isArrayEqual( array1, ['new', 'gathering', 'complete'] )
        && isArrayEqual( array2, ['new', 'gathering', 'complete'] )) {
        done();
      }
    }

    peer1.onicegatheringstatechange = function () {
      array1.push(peer1.iceGatheringState);
      checkdone();
    };

    peer2.onicegatheringstatechange = function () {
      array2.push(peer2.iceGatheringState);
      checkdone();
    };

    array1.push(peer1.iceGatheringState);
    array2.push(peer2.iceGatheringState);
    connect(peer1, peer2);
  });
});