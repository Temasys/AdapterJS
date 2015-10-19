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
var testItemTimeout = 5000;

var err = new ReferenceError('This is a bad function.');

// typeof webrtcObjectFunction
// Init in before
// Equals 'object' if IE + plugin
// Equals 'function' otherwise
var FUNCTION_TYPE = null;

describe('RTCPeerConnection | Properties', function() {
  this.timeout(testTimeout);

  var peer1 = null;
  var peer2 = null;
  var stream = null;

  var offer = null;
  var answer = null;

  var candidates1 = [];
  var candidates2 = [];


  /* WebRTC Object should be initialized in Safari/IE Plugin */
  before(function (done) {
    this.timeout(testItemTimeout);

    AdapterJS.webRTCReady(function() {
      FUNCTION_TYPE = webrtcDetectedBrowser === 'IE' ? 'object' : 'function';

      window.navigator.getUserMedia({
        audio: true,
        video: true

      }, function (data) {
        stream = data;
        done();

      }, function (error) {
        throw error;
      });
    });
  });

    /* Get User Media */
  beforeEach(function (done) {
    this.timeout(testItemTimeout);

    peer1 = new RTCPeerConnection({ iceServers: [] });
    peer2 = new RTCPeerConnection({ iceServers: [] });

    done();
  });

  it('RTCPeerConnection.localDescription :: object', function (done) {
    this.timeout(testItemTimeout);

    expect(peer1).to.have.property('localDescription');
    expect(peer2).to.have.property('localDescription');
    expect(peer1.localDescription).to.equal(null); // fails on Chrome
    expect(peer2.localDescription).to.equal(null); // fails on Chrome

    done();
  });

  it('RTCPeerConnection.remoteDescription :: object', function (done) {
    this.timeout(testItemTimeout);

    expect(peer1).to.have.property('remoteDescription');
    expect(peer2).to.have.property('remoteDescription');
    expect(peer1.remoteDescription).to.equal(null); // fails on Chrome
    expect(peer2.remoteDescription).to.equal(null); // fails on Chrome

    done();
  });

  it('RTCPeerConnection.signalingState :: string', function (done) {
    this.timeout(testItemTimeout);

    assert.typeOf(peer1.signalingState, 'string');
    assert.typeOf(peer2.signalingState, 'string');
    expect(peer1.signalingState).to.equal('stable');
    expect(peer2.signalingState).to.equal('stable');

    done();
  });

  it('RTCPeerConnection.iceConnectionState :: string', function (done) {
    this.timeout(testItemTimeout);

    assert.typeOf(peer1.iceConnectionState, 'string');
    assert.typeOf(peer2.iceConnectionState, 'string');
    expect(peer1.iceConnectionState).to.equal('new');
    expect(peer2.iceConnectionState).to.equal('new');

    done();
  });

  it('RTCPeerConnection.iceGatheringState :: string', function (done) {
    this.timeout(testItemTimeout);

    assert.typeOf(peer1.iceGatheringState, 'string');
    assert.typeOf(peer2.iceGatheringState, 'string');
    expect(peer1.iceGatheringState).to.equal('new');
    expect(peer2.iceGatheringState).to.equal('new');

    done();
  });

  it('RTCPeerConnection.canTrickleIceCandidates :: boolean', function (done) {
    // Note(J-O) fails on Chrome

    this.timeout(testItemTimeout);

    assert.typeOf(peer1.canTrickleIceCandidates, 'boolean');
    assert.typeOf(peer2.canTrickleIceCandidates, 'boolean');
    expect(peer1.canTrickleIceCandidates).to.equal(true);
    expect(peer2.canTrickleIceCandidates).to.equal(true);

    done();
  });

  it('RTCPeerConnection.getLocalStreams :: method', function (done) {
    this.timeout(testItemTimeout);

    assert.equal(typeof peer1.getLocalStreams, FUNCTION_TYPE);
    assert.equal(typeof peer2.getLocalStreams, FUNCTION_TYPE);

    var result1 = peer1.getLocalStreams();
    var result2 = peer2.getLocalStreams();
    assert.instanceOf(result1, Array);
    assert.instanceOf(result2, Array);

    done();
  });

  it('RTCPeerConnection.getRemoteStreams :: method', function (done) {
    this.timeout(testItemTimeout);

    assert.equal(typeof peer1.getRemoteStreams, FUNCTION_TYPE);
    assert.equal(typeof peer2.getRemoteStreams, FUNCTION_TYPE);

    var result1 = peer1.getRemoteStreams();
    var result2 = peer2.getRemoteStreams();
    assert.instanceOf(result1, Array);
    assert.instanceOf(result2, Array);

    done();
  });

  it('RTCPeerConnection.addStream :: method', function (done) {
    this.timeout(testItemTimeout);

    assert.equal(typeof peer1.addStream, FUNCTION_TYPE);
    assert.equal(typeof peer2.addStream, FUNCTION_TYPE);

    peer1.addStream(stream);
    peer2.addStream(stream);
    expect(peer1.getLocalStreams()).to.have.length(1);
    expect(peer2.getLocalStreams()).to.have.length(1);

    done();
  });

  it('RTCPeerConnection.addStream :: method < For > Multi-stream Feature', function (done) {
    this.timeout(testItemTimeout);

    peer1.addStream(stream);
    peer2.addStream(stream);

    expect(peer1.getLocalStreams()).to.have.length(1);
    expect(peer2.getLocalStreams()).to.have.length(1);

    getUserMedia({
        audio: true,
        video: true
      }, function (s) {
        peer1.addStream(s);
        peer2.addStream(s);

        expect(peer1.getLocalStreams()).to.have.length(2);
        expect(peer2.getLocalStreams()).to.have.length(2);

        done();
      }, function (error) {
        throw error;
      }
    );

  });

  it('RTCPeerConnection.removeStream :: method', function (done) {
    this.timeout(testItemTimeout);

    assert.equal(typeof peer1.removeStream, FUNCTION_TYPE);
    assert.equal(typeof peer2.removeStream, FUNCTION_TYPE);

    peer1.removeStream(stream);
    peer2.removeStream(stream);
    expect(peer1.getLocalStreams()).to.have.length(0);
    expect(peer2.getLocalStreams()).to.have.length(0);

    done();
  });

  it('RTCPeerConnection.getConfiguration :: method', function (done) {
    // Note(J-O) fails on Chrome
    this.timeout(testItemTimeout);

    assert.equal(typeof peer1.getConfiguration, FUNCTION_TYPE);
    assert.equal(typeof peer2.getConfiguration, FUNCTION_TYPE);

    var result1 = peer1.getConfiguration();
    var result2 = peer1.getConfiguration();
    assert.typeOf(result1, 'object');
    assert.typeOf(result2, 'object');

    done();
  });

  it.skip('RTCPeerConnection.updateIce :: method', function (done) {});

  it('RTCPeerConnection.getStreamById :: method', function (done) {
    this.timeout(testItemTimeout);

    assert.equal(typeof peer1.getStreamById, FUNCTION_TYPE);
    assert.equal(typeof peer2.getStreamById, FUNCTION_TYPE);

    var result1 = peer1.getStreamById(stream.id);
    var result2 = peer2.getStreamById(stream.id);

    expect(result1).to.be.null;
    expect(result2).to.be.null;

    peer1.addStream(stream);
    peer2.addStream(stream);

    var result1 = peer1.getStreamById(stream.id);
    var result2 = peer2.getStreamById(stream.id);

    expect(result1).to.equal(stream);
    expect(result2).to.equal(stream);

    done();
  });

  it('RTCPeerConnection.createDataChannel :: method', function (done) {
    this.timeout(testItemTimeout);

    assert.equal(typeof peer1.createDataChannel, FUNCTION_TYPE);
    assert.equal(typeof peer2.createDataChannel, FUNCTION_TYPE);

    var result1 = peer1.createDataChannel('Label');
    var result2 = peer2.createDataChannel('Label2');

    assert.typeOf(result1, 'object');
    assert.typeOf(result2, 'object');

    var result3 = peer1.createDataChannel('Label');
    var result4 = peer2.createDataChannel('Label2');

    assert.typeOf(result3, 'object');
    assert.typeOf(result4, 'object');

    done();
  });

  it('RTCPeerConnection.createDTMFSender :: method', function (done) {
    this.timeout(testItemTimeout);

    assert.equal(typeof peer1.createDTMFSender, FUNCTION_TYPE);
    assert.equal(typeof peer2.createDTMFSender, FUNCTION_TYPE);

    var track = stream.getAudioTracks()[0];

    var result1 = peer1.createDTMFSender(track);
    var result2 = peer2.createDTMFSender(track);

    assert.typeOf(result1, 'object');
    assert.typeOf(result2, 'object');

    expect(result1.track).to.equal(track);
    expect(result2.track).to.equal(track);

    done();
  });

  it('RTCPeerConnection.createOffer :: method', function (done) {
    this.timeout(testItemTimeout);

    assert.equal(typeof peer1.createOffer, FUNCTION_TYPE);
    assert.equal(typeof peer2.createOffer, FUNCTION_TYPE);

    peer1.addStream(stream);
    peer2.addStream(stream);

    peer1.createOffer(function (sdp) {

      offer = sdp;

      expect(sdp.type).to.equal('offer');
      assert.typeOf(sdp.sdp, 'string');

      expect(sdp.sdp).to.contain('=audio');
      expect(sdp.sdp).to.contain('=video');
      // expect(sdp.sdp).to.contain('=application'); // Note(J-O): I don't know what this is, commented

      done();

    }, function (error) {
      throw error;

    }, {
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    });
  });

  it('RTCPeerConnection.createOffer :: method < When > RTCPeerConnection.createOffer(invalid parameters)', function (done) {
    this.timeout(testItemTimeout);

    expect(function () {
      peer1.createOffer(function () {});
    }).to.throw(Error);

    expect(function () {
      peer2.createOffer(function () {});
    }).to.throw(Error);

    done();
  });

  it('RTCPeerConnection.setRemoteDescription(offer) :: method', function (done) {
    this.timeout(testItemTimeout);

    assert.equal(typeof peer2.setRemoteDescription, FUNCTION_TYPE);

    if (offer === null) {
      throw new Error('Offer Session Description is not yet created');
    }

    peer2.setRemoteDescription(offer, function () {

      expect(peer2.remoteDescription.sdp).to.equal(offer.sdp);
      expect(peer2.remoteDescription.type).to.equal(offer.type);
      done();

    }, function (error) {
      throw error;
    });
  });

  it('RTCPeerConnection.setRemoteDescription :: method < When > RTCPeerConnection.setRemoteDescription(invalid parameters)', function (done) {
    this.timeout(testItemTimeout);

    expect(function () {
      peer1.setRemoteDescription(function () {});
    }).to.throw(Error);

    expect(function () {
      peer2.setRemoteDescription(function () {});
    }).to.throw(Error);

    expect(function () {
      peer1.setRemoteDescription(offer, function () {});
    }).to.throw(Error);

    expect(function () {
      peer2.setRemoteDescription(offer, function () {});
    }).to.throw(Error);

    done();
  });

  it('RTCPeerConnection.createAnswer :: method', function (done) {
    this.timeout(testItemTimeout);

    assert.equal(typeof peer1.createAnswer, FUNCTION_TYPE);
    assert.equal(typeof peer2.createAnswer, FUNCTION_TYPE);

    peer1.addStream(stream);

    peer1.createOffer(function (offer) {
      peer2.setRemoteDescription(offer);
      peer2.createAnswer(function (answer) {

        expect(answer.type).to.equal('answer');
        assert.typeOf(answer.sdp, 'string');

        expect(answer.sdp).to.contain('=audio');
        expect(answer.sdp).to.contain('=video');
        // expect(sdp.sdp).to.contain('=application'); // Note(J-O): I don't know what this is, commented

        done();

      }, function (error) {
        throw error;
      });
    }, function(error) {
      throw error;
    });

  });

  it.skip('RTCPeerConnection.createAnswer :: method < When > RTCPeerConnection.createAnswer(invalid parameters)', function (done) {
    this.timeout(testItemTimeout);

    expect(function () {
      peer1.createAnswer(function () {});
    }).to.throw(err);

    expect(function () {
      peer2.createAnswer(function () {});
    }).to.throw(err);

    done();
  });

  it('RTCPeerConnection.setLocalDescription(offer) :: method', function (done) {
    this.timeout(testItemTimeout);

    assert.equal(typeof peer1.setLocalDescription, FUNCTION_TYPE);

    peer1.createOffer(function(offer) {
      peer1.setLocalDescription(offer, function () {

        expect(peer1.localDescription.sdp).to.deep.equal(offer.sdp);
        expect(peer1.localDescription.type).to.deep.equal(offer.type);
        done();

      }, function (error) {
        throw error;
      });
    }, function (error) {
      throw error;
    });
  });

  it.skip('RTCPeerConnection.setLocalDescription :: method < When > RTCPeerConnection.setLocalDescription(invalid parameters)', function (done) {
    this.timeout(testItemTimeout);

    expect(function () {
      peer1.setLocalDescription(function () {});
    }).to.throw(Error);

    expect(function () {
      peer2.setLocalDescription(function () {});
    }).to.throw(Error);

    expect(function () {
      peer1.setLocalDescription(offer, function () {});
    }).to.throw(Error);

    expect(function () {
      peer2.setLocalDescription(offer, function () {});
    }).to.throw(Error);

    done();
  });

  it('RTCPeerConnection.setLocalDescription(offer) :: method < When > RTCPeerConnection.setLocalDescription(RTCPeerConnection.localDescription)', function (done) {
    this.timeout(testItemTimeout);

    assert.equal(typeof peer1.setLocalDescription, FUNCTION_TYPE);

    var localSDP;
    var localType;

    peer1.createOffer(function(offer) {
      peer1.setLocalDescription(offer, function () {
        // Store expected values
        localSDP  = offer.sdp;
        localType = offer.type;

        peer1.setLocalDescription(peer1.localDescription, function() {
          // After self setting description, the description should not have changed
          expect(peer1.localDescription.sdp).to.deep.equal(localSDP);
          expect(peer1.localDescription.type).to.deep.equal(localType);
          done();
        }, function (error) { throw error; });
      }, function (error) { throw error; });
    }, function (error) { throw error; });
  });

  it('RTCPeerConnection.setLocalDescription(answer) :: method', function (done) {
    this.timeout(testItemTimeout);

    assert.equal(typeof peer2.setLocalDescription, FUNCTION_TYPE);

    //TODO(anyone): this is unreadable...
    peer1.createOffer(
      function(offer) {
        peer2.setRemoteDescription(offer);
        peer2.createAnswer(function(answer) {
          peer2.setLocalDescription(answer, function () {
            expect(peer2.localDescription.sdp).to.deep.equal(answer.sdp);
            expect(peer2.localDescription.type).to.deep.equal(answer.type);
            done();
          }, function (error) { throw error; }); // end of set local
        }, function (error) { throw error; }); // end of create answer
      }, function(error) { throw error; }); // enf of create offer
  });

  it('RTCPeerConnection.setRemoteDescription(answer) :: method < When > RTCPeerConnection.setRemoteDescription(RTCPeerConnection.remoteDescription)', function (done) {
    this.timeout(testItemTimeout);

    assert.equal(typeof peer2.setLocalDescription, FUNCTION_TYPE);

    var offer, answer;
    var sdp;
    var type;

    peer1.createOffer(function(offer) {
      // Store expected values
      sdp  = offer.sdp;
      type = offer.type;

      peer2.setRemoteDescription(offer, function() {
        peer2.setRemoteDescription(peer2.remoteDescription, function() {
          expect(peer2.remoteDescription.sdp).to.deep.equal(offer.sdp);
          expect(peer2.remoteDescription.type).to.deep.equal(offer.type);
          done();
        }, function (error) { throw error; });
      }, function (error) { throw error; });
    }, function (error) { throw error; });
  });

  it('RTCPeerConnection.setRemoteDescription(answer) :: method', function (done) {
    this.timeout(testItemTimeout);

    assert.equal(typeof peer1.setRemoteDescription, FUNCTION_TYPE);

    //TODO(anyone): this is unreadable...
    peer1.createOffer(
      function(offer) {
        peer1.setLocalDescription(offer);
        peer2.setRemoteDescription(offer);
        peer2.createAnswer(function(answer) {
          peer1.setRemoteDescription(answer, function () {
            expect(peer1.remoteDescription.sdp).to.deep.equal(answer.sdp);
            expect(peer1.remoteDescription.type).to.deep.equal(answer.type);
            done();
          }, function (error) { throw error; });
        }, function (error) { throw error; });
      }, function(error) { throw error; });
  });

  it('RTCPeerConnection.addIceCandidate :: method', function (done) {
    this.timeout(testItemTimeout);

    assert.equal(typeof peer1.addIceCandidate, FUNCTION_TYPE);
    assert.equal(typeof peer2.addIceCandidate, FUNCTION_TYPE);

    var peer1IceCount = 0;
    var peer2IceCount = 0;
    var peer1IceGathered = false;
    var peer2IceGathered = false;
    var iceAddSuccess1 = 0;
    var iceAddSuccess2 = 0;

    checkdone = function() {
      if (peer1IceGathered && peer2IceGathered) {
        assert.notEqual(peer1IceCount, 0);
        assert.notEqual(peer2IceCount, 0);
        assert.equal(peer2IceCount, iceAddSuccess1);
        assert.equal(peer1IceCount, iceAddSuccess2);
        done();
      }
    };

    peer1.onicecandidate = function (event) {
      var candidate = event.candidate;

      if (candidate === null) {
        peer1IceGathered = true;
        checkdone();
      } else {
        ++peer1IceCount;
        // TODO(J-O): since we don't test addIceCandidate here, can we remove it ?
        peer2.addIceCandidate(candidate, function () {
          ++iceAddSuccess2;
        }, function (error) {
          throw error;
        });
      }
    };

    peer2.onicecandidate = function (event) {
      var candidate = event.candidate;

      if (candidate === null) {
        peer2IceGathered = true;
        checkdone();
      } else {
        ++peer2IceCount;
        // TODO(J-O): since we don't test addIceCandidate here, can we remove it ?
        peer1.addIceCandidate(candidate, function () {
          ++iceAddSuccess1;
        }, function (error) {
          throw error;
        });
      }
    };

    connect(peer1, peer2);
  });

  it('RTCPeerConnection.addIceCandidate :: method < When > RTCPeerConnection.addIceCandidate(invalid parameters)', function (done) {
    this.timeout(testItemTimeout);

    expect(function () {
      peer1.addIceCandidate(candidates1[0]);
    }).to.not.throw(Error);

    expect(function () {
      peer2.addIceCandidate(candidates2[0]);
    }).to.not.throw(Error);

    expect(function () {
      peer1.addIceCandidate(candidates1[0], function () {});
    }).to.throw(Error);

    expect(function () {
      peer2.addIceCandidate(candidates2[0], function () {});
    }).to.throw(Error);

    expect(function () {
      peer1.addIceCandidate(candidates1[0], function () {}, function () {});
    }).to.throw(Error);

    expect(function () {
      peer2.addIceCandidate(candidates2[0], function () {}, function () {});
    }).to.throw(Error);

    done();
  });

  it('RTCPeerConnection.close :: method', function (done) {
    this.timeout(testItemTimeout);

    assert.equal(typeof peer1.close, FUNCTION_TYPE);
    assert.equal(typeof peer2.close, FUNCTION_TYPE);

    peer1.close();
    peer2.close();

    setTimeout(function () {
      expect(peer1.iceConnectionState).to.equal('closed');
      expect(peer2.iceConnectionState).to.equal('closed');
      expect(peer1.signalingState).to.equal('closed');
      expect(peer2.signalingState).to.equal('closed');
      
      done();
    }, 2000);
  });
});