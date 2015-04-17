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

    var getMedia = function () {
      window.navigator.getUserMedia({
        audio: true,
        video: true

      }, function (data) {
        stream = data;

        peer1 = new RTCPeerConnection({ iceServers: [] });
        peer2 = new RTCPeerConnection({ iceServers: [] });

        peer1.onicecandidate = function (event) {
          var candidate = event.candidate || event;

          candidates2.push(candidate);
        };

        peer2.onicecandidate = function (event) {
          var candidate = event.candidate || event;

          candidates1.push(candidate);
        };

        done();

      }, function (error) {
        throw error;
      });
    };

    if (window.webrtcDetectedBrowser !== 'IE' && window.webrtcDetectedBrowser !== 'Safari') {
      AdapterJS.onwebrtcreadyDone = true;
    }

    if (!AdapterJS.onwebrtcreadyDone) {
      AdapterJS.onwebrtcready = getMedia;

    } else {
      getMedia();
    }
  });

  it('RTCPeerConnection.localDescription :: object', function () {
    this.timeout(testItemTimeout);

    expect(peer1).to.have.property('localDescription');
    expect(peer2).to.have.property('localDescription');
    expect(peer1.localDescription).to.equal(null);
    expect(peer2.localDescription).to.equal(null);
  });

  it('RTCPeerConnection.remoteDescription :: object', function () {
    this.timeout(testItemTimeout);

    expect(peer1).to.have.property('remoteDescription');
    expect(peer2).to.have.property('remoteDescription');
    expect(peer1.remoteDescription).to.equal(null);
    expect(peer2.remoteDescription).to.equal(null);
  });

  it('RTCPeerConnection.signalingState :: string', function () {
    this.timeout(testItemTimeout);

    assert.typeOf(peer1.signalingState, 'string');
    assert.typeOf(peer2.signalingState, 'string');
    expect(peer1.remoteDescription).to.equal('stable');
    expect(peer2.remoteDescription).to.equal('stable');
  });

  it('RTCPeerConnection.iceConnectionState :: string', function () {
    this.timeout(testItemTimeout);

    assert.typeOf(peer1.iceConnectionState, 'string');
    assert.typeOf(peer2.iceConnectionState, 'string');
    expect(peer1.iceConnectionState).to.equal('new');
    expect(peer2.iceConnectionState).to.equal('new');
  });

  it('RTCPeerConnection.iceGatheringState :: string', function () {
    this.timeout(testItemTimeout);

    assert.typeOf(peer.iceGatheringState, 'string');
    expect(peer.iceGatheringState).to.equal('new');
  });

  it('RTCPeerConnection.canTrickleIceCandidates :: boolean', function () {
    this.timeout(testItemTimeout);

    assert.typeOf(peer1.canTrickleIceCandidates, 'boolean');
    assert.typeOf(peer2.canTrickleIceCandidates, 'boolean');
    expect(peer1.canTrickleIceCandidates).to.equal(true);
    expect(peer2.canTrickleIceCandidates).to.equal(true);
  });

  it('RTCPeerConnection.getLocalStreams :: method', function () {
    this.timeout(testItemTimeout);

    assert.typeOf(peer1.getLocalStreams, 'function');
    assert.typeOf(peer2.getLocalStreams, 'function');

    var result1 = peer1.getLocalStreams();
    var result2 = peer2.getLocalStreams();
    assert.instanceOf(result1, Array);
    assert.instanceOf(result2, Array);
  });

  it('RTCPeerConnection.getRemoteStreams :: method', function () {
    this.timeout(testItemTimeout);

    assert.typeOf(peer1.getRemoteStreams, 'function');
    assert.typeOf(peer2.getRemoteStreams, 'function');

    var result1 = peer1.getRemoteStreams();
    var result2 = peer2.getRemoteStreams();
    assert.instanceOf(result1, Array);
    assert.instanceOf(result2, Array);
  });

  it('RTCPeerConnection.addStream :: method', function () {
    this.timeout(testItemTimeout);

    assert.typeOf(peer1.addStream, 'function');
    assert.typeOf(peer2.addStream, 'function');

    peer1.addStream(stream);
    peer2.addStream(stream);
    expect(peer1.getLocalStreams()).to.have.length(1);
    expect(peer2.getLocalStreams()).to.have.length(1);
  });

  it('RTCPeerConnection.addStream :: method < For > Multi-stream Feature', function () {
    this.timeout(testItemTimeout);

    peer1.addStream(stream);
    peer2.addStream(stream);
    expect(peer1.getLocalStreams()).to.have.length(2);
    expect(peer2.getLocalStreams()).to.have.length(2);
  });

  it('RTCPeerConnection.removeStream :: method', function () {
    this.timeout(testItemTimeout);

    assert.typeOf(peer1.removeStream, 'function');
    assert.typeOf(peer2.removeStream, 'function');

    peer1.removeStream(stream);
    peer2.removeStream(stream);
    expect(peer1.getLocalStreams()).to.have.length(0);
    expect(peer2.getLocalStreams()).to.have.length(0);
  });

  it('RTCPeerConnection.getConfiguration :: method', function () {
    this.timeout(testItemTimeout);

    assert.typeOf(peer1.getConfiguration, 'function');
    assert.typeOf(peer2.getConfiguration, 'function');

    var result1 = peer1.getConfiguration();
    var result2 = peer1.getConfiguration();
    assert.typeOf(result1, 'object');
    assert.typeOf(result2, 'object');
  });

  it.skip('RTCPeerConnection.updateIce :: method', function () {});

  it('RTCPeerConnection.getStreamById :: method', function () {
    this.timeout(testItemTimeout);

    assert.typeOf(peer1.getStreamById, 'function');
    assert.typeOf(peer2.getStreamById, 'function');

    var result1 = peer1.getStreamById(stream.id);
    var result2 = peer2.getStreamById(stream.id);
    expect(result1).to.equal(stream);
    expect(result2).to.equal(stream);
  });

  it('RTCPeerConnection.createDataChannel :: method', function () {
    this.timeout(testItemTimeout);

    assert.typeOf(peer1.createDataChannel, 'function');
    assert.typeOf(peer2.createDataChannel, 'function');

    var result1 = peer1.createDataChannel('Label');
    var result2 = peer2.createDataChannel('Label2');

    assert.typeOf(result1, 'object');
    assert.typeOf(result2, 'object');

    expect(function () {
      var result3 = peer1.createDataChannel('Label');
    }).to.throw(Error);

    expect(function () {
      var result4 = peer2.createDataChannel('Label');
    }).to.not.throw(Error);
  });

  it('RTCPeerConnection.createDTMFSender :: method', function () {
    this.timeout(testItemTimeout);

    assert.typeOf(peer1.createDTMFSender, 'function');
    assert.typeOf(peer2.createDTMFSender, 'function');

    var track = stream.getAudioTracks()[0];

    var result1 = peer1.createDTMFSender(track);
    var result2 = peer2.createDTMFSender(track);

    assert.typeOf(result1, 'object');
    assert.typeOf(result2, 'object');

    expect(result1.track).to.equal(track);
    expect(result2.track).to.equal(track);
  });

  it('RTCPeerConnection.createOffer :: method', function (done) {
    this.timeout(testItemTimeout);

    assert.typeOf(peer1.createOffer, 'function');
    assert.typeOf(peer2.createOffer, 'function');

    peer1.addStream(stream);
    peer2.addStream(stream);

    peer1.createOffer(function (sdp) {

      offer = sdp;

      expect(sdp.type).to.equal('offer');
      assert.typeOf(sdp.sdp, 'string');

      expect(sdp.sdp).to.contain('=audio');
      expect(sdp.sdp).to.contain('=video');
      expect(sdp.sdp).to.contain('=application');

      done();

    }, function (error) {
      throw error;

    }, {
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    });
  });

  it('RTCPeerConnection.createOffer :: method < When > RTCPeerConnection.createOffer(invalid parameters)', function () {
    this.timeout(testItemTimeout);

    expect(function () {
      peer1.createOffer(function () {});
    }).to.throw(Error);

    expect(function () {
      peer2.createOffer(function () {});
    }).to.throw(Error);
  });

  it('RTCPeerConnection.setRemoteDescription(offer) :: method', function (done) {
    this.timeout(testItemTimeout);

    assert.typeOf(peer2.setRemoteDescription, 'function');

    if (offer === null) {
      throw new Error('Offer Session Description is not yet created');
    }

    peer2.setRemoteDescription(offer, function () {

      expect(peer2.remoteDescription).to.equal(offer);
      done();

    }, function (error) {
      throw error;
    });
  });

  it('RTCPeerConnection.setRemoteDescription :: method < When > RTCPeerConnection.setRemoteDescription(invalid parameters)', function () {
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
  });

  it('RTCPeerConnection.createAnswer :: method', function (done) {
    this.timeout(testItemTimeout);

    assert.typeOf(peer1.createAnswer, 'function');
    assert.typeOf(peer2.createAnswer, 'function');

    peer2.createAnswer(function (sdp) {

      answer = sdp;

      expect(sdp.type).to.equal('answer');
      assert.typeOf(sdp.sdp, 'string');

      expect(sdp.sdp).to.contain('=audio');
      expect(sdp.sdp).to.contain('=video');
      expect(sdp.sdp).to.contain('=application');

      done();

    }, function (error) {
      throw error;
    });
  });

  it('RTCPeerConnection.createAnswer :: method < When > RTCPeerConnection.createAnswer(invalid parameters)', function () {
    this.timeout(testItemTimeout);

    expect(function () {
      peer1.createAnswer(function () {});
    }).to.throw(Error);

    expect(function () {
      peer2.createAnswer(function () {});
    }).to.throw(Error);
  });

  it('RTCPeerConnection.setLocalDescription(offer) :: method', function (done) {
    this.timeout(testItemTimeout);

    assert.typeOf(peer1.setLocalDescription, 'function');

    peer1.setLocalDescription(offer, function () {

      expect(peer1.localDescription).to.equal(offer);
      done();

    }, function (error) {
      throw error;
    });
  });

  it('RTCPeerConnection.setLocalDescription :: method < When > RTCPeerConnection.setLocalDescription(invalid parameters)', function () {
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
  });

  it('RTCPeerConnection.setLocalDescription(answer) :: method', function (done) {
    this.timeout(testItemTimeout);

    assert.typeOf(peer2.setLocalDescription, 'function');

    peer2.setLocalDescription(answer, function () {

      expect(peer2.localDescription).to.equal(answer);
      done();

    }, function (error) {
      throw error;
    });
  });

  it('RTCPeerConnection.setRemoteDescription(answer) :: method', function (done) {
    this.timeout(testItemTimeout);

    assert.typeOf(peer1.setRemoteDescription, 'function');

    peer1.setRemoteDescription(answer, function () {

      expect(peer1.remoteDescription).to.equal(answer);
      done();

    }, function (error) {
      throw error;
    });
  });

  it('RTCPeerConnection.addIceCandidate :: method', function (done) {
    this.timeout(testItemTimeout);

    assert.typeOf(peer1.addIceCandidate, 'function');
    assert.typeOf(peer2.addIceCandidate, 'function');

    var i, j;
    var success1 = 0;
    var success2 = 0;

    for (i = 0; i < candidates1.length; i += 1) {

      peer1.addIceCandidate(candidates1[i], function () {
        success1 += 1;
      }, function (error) {
        throw error;
      });
    }

    for (j = 0; j < candidates2.length; j += 1) {
      peer2.addIceCandidate(candidates2[j], function () {
        success2 += 1;
      }, function (error) {
        throw error;
      });
    }

    setTimeout(function () {
      expect(success1).to.equal(candidates1.length);
      expect(success2).to.equal(candidates2.length);
      done();
    }, 2000);
  });

  it('RTCPeerConnection.addIceCandidate :: method < When > RTCPeerConnection.addIceCandidate(invalid parameters)', function () {
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
  });

  it('RTCPeerConnection.close :: method', function (done) {
    this.timeout(testItemTimeout);

    assert.typeOf(peer1.close, 'function');
    assert.typeOf(peer2.close, 'function');

    peer1.close();
    peer2.close();

    setTimeout(function () {
      expect(peer1.iceConnectionState).to.equal('close');
      expect(peer2.iceConnectionState).to.equal('close');
      expect(peer1.signalingState).to.equal('close');
      expect(peer2.signalingState).to.equal('close');

      expect(function () {
        peer1.removeStream(stream);
      }).to.throw(Error);

      expect(function () {
        peer2.removeStream(stream);
      }).to.throw(Error);

      expect(function () {
        peer1.addStream(stream);
      }).to.throw(Error);

      expect(function () {
        peer2.addStream(stream);
      }).to.throw(Error);

      expect(function () {
        peer1.createOffer(function () {}, function () {});
      }).to.throw(Error);

      expect(function () {
        peer2.createOffer(function () {}, function () {});
      }).to.throw(Error);

      expect(function () {
        peer1.createAnswer(function () {}, function () {});
      }).to.throw(Error);

      expect(function () {
        peer2.createAnswer(function () {}, function () {});
      }).to.throw(Error);

      done();
    }, 2000);
  });
});