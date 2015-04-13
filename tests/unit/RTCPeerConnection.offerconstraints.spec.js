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

// Parse the constraints of getUserMedia
var printJSON = function (obj, spaces) {
  spaces = typeof spaces !== 'number' ? 2 : spaces;

  // make indentation
  var makeIndentation = function (spaces) {
    var str = '';
    var i;

    for (i = 0; i < spaces; i += 1) {
      str += ' ';
    }

    return str;
  };

  var opening = '{';
  var closing = '}';

  if (obj instanceof Array) {
    opening = '[';
    closing = ']';
  }

  // parse object
  var outputStr = makeIndentation(spaces - 2) + opening;
  var val;


  if (!(obj instanceof Array)) {
    var key;

    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        outputStr += '\n\t' + makeIndentation(spaces) + '"' + key + '": ';

        val = obj[key];

        if (typeof val === 'object') {
          outputStr += printJSON(val, spaces + 2);

        } else if (typeof val === 'string') {
          outputStr += '"' + val + '"';

        } else {
          outputStr += val;
        }

        outputStr += ',';
      }
    }
  } else {
    var i;

    for (i = 0; i < obj.length; i += 1) {
      val = obj[i];

      if (typeof val === 'object') {
        outputStr += printJSON(val, spaces + 2);

      } else if (typeof val === 'string') {
        outputStr += '"' + val + '"';

      } else {
        outputStr += val;
      }

      if (i < (obj.length - 1)) {
        outputStr += ',';
      }
    }
  }

  outputStr += '\n\t' + makeIndentation(spaces - 2) + closing;

  return outputStr;
};


describe('RTCPeerConnection.createOffer | RTCOfferOptions', function() {
  this.timeout(testTimeout);

  var peer1 = null;
  var peer2 = null;

  var stream = null;

  var tc1Constraints = {
    iceRestart: true
  };

  var tc2Constraints = {
    voiceActivityDetection: true
  };

  var tc3Constraints = {
    offerToReceiveVideo: true,
    offerToReceiveAudio: false
  };

  var tc4Constraints = {
    offerToReceiveVideo: true
  };

  var tc5Constraints = {
    offerToReceiveVideo: false,
    offerToReceiveAudio: true
  };

  var tc6Constraints = {
    offerToReceiveAudio: true
  };

  var tc7Constraints = {
    offerToReceiveVideo: true,
    offerToReceiveAudio: true
  };

  var tc8Constraints = {
    offerToReceiveVideo: false,
    offerToReceiveAudio: false
  };

  var tc9Constraints = {};

  var connect = function (offerConstraints) {
    peer1.createOffer(function (offer) {

      peer2.setRemoteDescription(offer, function () {

        peer2.createAnswer(function (answer) {

          peer1.setLocalDescription(offer, function () {

            peer2.setLocalDescription(answer, function () {

              peer1.setRemoteDescription(answer, function () {

              // Peer 1 - Remote answer
              }, function (error) {
                throw error;
              });
            // Peer 2 - Local answer
            }, function (error) {
              throw error;
            });
          // Peer 1 - Local offer
          }, function (error) {
            throw error;
          });
        // Peer 2 - Create answer
        }, function (error) {
          throw error;
        });
      // Peer 2 - Remote offer
      }, function (error) {
        throw error;
      });
    // Peer 1 - Create offer
    }, function (error) {
      throw error;
    }, offerConstraints);
  };

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


  it.skip('RTCPeerConnection.createOffer(successCb, failureCb, ' + printJSON(tc1Constraints) + ')', function () {});

  it.skip('RTCPeerConnection.createOffer(successCb, failureCb, ' + printJSON(tc2Constraints) + ')', function () {});

  it('RTCPeerConnection.createOffer(successCb, failureCb, ' + printJSON(tc3Constraints) + ')', function () {
    this.timeout(testItemTimeout);

    peer2.onaddstream = function (event) {
      var remoteStream = event.stream || event;

      expect(remoteStream.getAudioTracks()).to.have.length(0);
      expect(remoteStream.getVideoTracks()).to.have.length(1);
    };

    connect(tc3Constraints);
  });

  it('RTCPeerConnection.createOffer(successCb, failureCb, ' + printJSON(tc4Constraints) + ')', function () {
    this.timeout(testItemTimeout);

    peer2.onaddstream = function (event) {
      var remoteStream = event.stream || event;

      expect(remoteStream.getAudioTracks()).to.have.length(0);
      expect(remoteStream.getVideoTracks()).to.have.length(1);
    };

    connect(tc4Constraints);
  });

  it('RTCPeerConnection.createOffer(successCb, failureCb, ' + printJSON(tc5Constraints) + ')', function () {
    this.timeout(testItemTimeout);

    peer2.onaddstream = function (event) {
      var remoteStream = event.stream || event;

      expect(remoteStream.getAudioTracks()).to.have.length(1);
      expect(remoteStream.getVideoTracks()).to.have.length(0);
    };

    connect(tc5Constraints);
  });

  it('RTCPeerConnection.createOffer(successCb, failureCb, ' + printJSON(tc6Constraints) + ')', function () {
    this.timeout(testItemTimeout);

    peer2.onaddstream = function (event) {
      var remoteStream = event.stream || event;

      expect(remoteStream.getAudioTracks()).to.have.length(1);
      expect(remoteStream.getVideoTracks()).to.have.length(0);
    };

    connect(tc6Constraints);
  });

  it('RTCPeerConnection.createOffer(successCb, failureCb, ' + printJSON(tc7Constraints) + ')', function () {
    this.timeout(testItemTimeout);

    peer2.onaddstream = function (event) {
      var remoteStream = event.stream || event;

      expect(remoteStream.getAudioTracks()).to.have.length(1);
      expect(remoteStream.getVideoTracks()).to.have.length(1);
    };

    connect(tc7Constraints);
  });

  it('RTCPeerConnection.createOffer(successCb, failureCb, ' + printJSON(tc8Constraints) + ')', function () {
    this.timeout(testItemTimeout);

    peer2.onaddstream = function (event) {
      var remoteStream = event.stream || event;

      expect(remoteStream.getAudioTracks()).to.have.length(0);
      expect(remoteStream.getVideoTracks()).to.have.length(0);
    };

    connect(tc8Constraints);
  });

  it('RTCPeerConnection.createOffer(successCb, failureCb, ' + printJSON(tc9Constraints) + ')', function () {
    this.timeout(testItemTimeout);

    expect(function () {
      connect(tc9Constraints);
    }).to.throw(Error);
  });
});