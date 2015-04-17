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
var testItemTimeout = 2000;


describe('RTCPeerConnection.createOffer | RTCOfferOptions', function() {
  this.timeout(testTimeout);

  var peer1 = null;
  var peer2 = null;

  var stream = null;


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

  /* Create peer objects */
  beforeEach(function (done) {
    peer1 = new RTCPeerConnection({
      iceServers: []
    });

    peer2 = new RTCPeerConnection({
      iceServers: []
    });

    window.navigator.getUserMedia({
      audio: true,
      video: true

    }, function (data) {
      stream = data;
      peer1.addStream(stream);
      done();

    }, function (error) {
      throw error;
    });
  });


  (function (constraints) {

    it.skip('RTCPeerConnection.createOffer(successCb, failureCb, ' + printJSON(constraints) + ')', function () {});

  })({ iceRestart: true });


  (function (constraints) {

    it.skip('RTCPeerConnection.createOffer(successCb, failureCb, ' + printJSON(constraints) + ')', function () {});

  })({ voiceActivityDetection: true });


  (function (constraints) {

    it('RTCPeerConnection.createOffer(successCb, failureCb, ' + printJSON(constraints) + ')', function () {
      this.timeout(testItemTimeout);

      peer2.onaddstream = function (event) {
        var remoteStream = event.stream || event;

        expect(remoteStream.getAudioTracks()).to.have.length(0);
        expect(remoteStream.getVideoTracks()).to.have.length(1);
      };

      connect(peer1, peer2, null, constraints);
    });

  })({ offerToReceiveVideo: true, offerToReceiveAudio: false });


  (function (constraints) {

    it('RTCPeerConnection.createOffer(successCb, failureCb, ' + printJSON(constraints) + ')', function () {
      this.timeout(testItemTimeout);

      peer2.onaddstream = function (event) {
        var remoteStream = event.stream || event;

        expect(remoteStream.getAudioTracks()).to.have.length(0);
        expect(remoteStream.getVideoTracks()).to.have.length(1);
      };

      connect(peer1, peer2, null, constraints);
    });

  })({ offerToReceiveVideo: true });


  (function (constraints) {

    it('RTCPeerConnection.createOffer(successCb, failureCb, ' + printJSON(constraints) + ')', function () {
      this.timeout(testItemTimeout);

      peer2.onaddstream = function (event) {
        var remoteStream = event.stream || event;

        expect(remoteStream.getAudioTracks()).to.have.length(1);
        expect(remoteStream.getVideoTracks()).to.have.length(0);
      };

      connect(peer1, peer2, null, constraints);
    });

  })({ offerToReceiveVideo: false, offerToReceiveAudio: true });


  (function (constraints) {

    it('RTCPeerConnection.createOffer(successCb, failureCb, ' + printJSON(constraints) + ')', function () {
      this.timeout(testItemTimeout);

      peer2.onaddstream = function (event) {
        var remoteStream = event.stream || event;

        expect(remoteStream.getAudioTracks()).to.have.length(1);
        expect(remoteStream.getVideoTracks()).to.have.length(0);
      };

      connect(peer1, peer2, null, constraints);
    });

  })({ offerToReceiveAudio: true });


  (function (constraints) {

    it('RTCPeerConnection.createOffer(successCb, failureCb, ' + printJSON(constraints) + ')', function () {
      this.timeout(testItemTimeout);

      peer2.onaddstream = function (event) {
        var remoteStream = event.stream || event;

        expect(remoteStream.getAudioTracks()).to.have.length(1);
        expect(remoteStream.getVideoTracks()).to.have.length(1);
      };

      connect(peer1, peer2, null, constraints);
    });

  })({ offerToReceiveVideo: true, offerToReceiveAudio: true });


  (function (constraints) {

    it('RTCPeerConnection.createOffer(successCb, failureCb, ' + printJSON(constraints) + ')', function () {
      this.timeout(testItemTimeout);

      peer2.onaddstream = function (event) {
        var remoteStream = event.stream || event;

        expect(remoteStream.getAudioTracks()).to.have.length(0);
        expect(remoteStream.getVideoTracks()).to.have.length(0);
      };

      connect(peer1, peer2, null, constraints);
    });

  })({ offerToReceiveVideo: false, offerToReceiveAudio: false });


  (function (constraints) {

    it('RTCPeerConnection.createOffer(successCb, failureCb, ' + printJSON(constraints) + ')', function () {
      this.timeout(testItemTimeout);

      expect(function () {
        connect(peer1, peer2, null, constraints);
      }).to.throw(Error);
    });

  })({});
});