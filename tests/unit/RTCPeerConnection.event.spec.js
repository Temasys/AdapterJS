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


  var connect = function () {
    peer1.addStream(stream);
    peer2.addStream(stream);

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
    }, {
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    });
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

  /*

  interface RTCPeerConnection : EventTarget  {
    void                           close ();
                attribute EventHandler           onnegotiationneeded;
                attribute EventHandler           onicecandidate;
                attribute EventHandler           onsignalingstatechange;
                attribute EventHandler           onaddstream;
                attribute EventHandler           onremovestream;
                attribute EventHandler           oniceconnectionstatechange;
                attribute EventHandler           onicegatheringstatechange;

  */

  it.skip('RTCPeerConnection.onnegotiationneeded :: emit < When > RTCPeerConnection.addStream(stream)', function () {});

  it.skip('RTCPeerConnection.onnegotiationneeded :: emit < When > RTCPeerConnection.removeStream(stream)', function () {});

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

    connect();

    setTimeout(function () {
      expect(array1).to.equal(['have-local-offer', 'stable']);
      expect(array2).to.equal(['have-remote-offer', 'stable']);
      done();
    }, 2000);
  });

  it('RTCPeerConnection.onicecandidate :: emit', function (done) {
    this.timeout(testItemTimeout);

    var peer1IceGathered = false;
    var peer2IceGathered = false;

    peer1.onicecandidate = function () {
      var candidate = event.candidate || event;

      if (candiate.candiate !== null) {
        peer2.addIceCandidate(candidate);

      } else {
        peer1IceGathered = true;
      }
    };

    peer2.onicecandidate = function () {
      var candidate = event.candidate || event;

      if (candiate.candiate !== null) {
        peer1.addIceCandidate(candidate);

      } else {
        peer2IceGathered = true;
      }
    };

    connect();

    setTimeout(function () {
      expect(peer1IceGathered).to.equal(true);
      expect(peer2IceGathered).to.equal(true);
      done();
    }, 3500);
  });

  it('RTCPeerConnection.oniceconnectionstatechange :: emit', function (done) {
    this.timeout(testItemTimeout);

    var array1 = [];
    var array2 = [];

    peer1.onicecandidate = function () {
      var candidate = event.candidate || event;

      if (candiate.candiate !== null) {
        peer2.addIceCandidate(candidate);

      } else {
        peer1IceGathered = true;
      }
    };

    peer2.onicecandidate = function () {
      var candidate = event.candidate || event;

      if (candiate.candiate !== null) {
        peer1.addIceCandidate(candidate);

      } else {
        peer2IceGathered = true;
      }
    };

    peer1.oniceconnectionstatechange = function () {
      array1.push(peer1.iceConnectionState);
    };

    peer2.oniceconnectionstatechange = function () {
      array2.push(peer2.iceConnectionState);
    };

    connect();

    setTimeout(function () {
      expect(array1).to.equal(['checking', 'connected', 'completed', 'closed']);
      expect(array2).to.equal(['checking', 'connected', 'completed', 'closed']);
      done();
    }, 3500);
  });

  it('RTCPeerConnection.onicegatheringstatechange :: emit', function (done) {
    this.timeout(testItemTimeout);

    var array1 = [];
    var array2 = [];

    peer1.onicecandidate = function () {
      var candidate = event.candidate || event;

      if (candiate.candiate !== null) {
        peer2.addIceCandidate(candidate);

      } else {
        expect(array1).to.include('complete');
      }
    };

    peer2.onicecandidate = function () {
      var candidate = event.candidate || event;

      if (candiate.candiate !== null) {
        peer1.addIceCandidate(candidate);

      } else {
        expect(array2).to.include('complete');
      }
    };

    peer1.onicegatheringstatechange = function () {
      array1.push(peer1.iceGatheringState);
    };

    peer2.onicegatheringstatechange = function () {
      array2.push(peer2.iceGatheringState);
    };

    connect();

    setTimeout(function () {
      expect(array1).to.equal(['new', 'gathering', 'complete']);
      expect(array2).to.equal(['new', 'gathering', 'complete']);
      done();
    }, 3500);
  });

  it('RTCPeerConnection.onaddstream :: emit', function (done) {
    this.timeout(testItemTimeout);

    var remoteStream1 = null;
    var remoteStream2 = null;

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

    peer1.onaddstream = function (event) {
      remoteStream1 = event.stream || event;
    };

    peer2.onaddstream = function () {
      remoteStream2 = event.stream || event;
    };

    connect();

    setTimeout(function () {
      expect(remoteStream1.getAudioTracks()).to.have.length(stream.getAudioTracks().length);
      expect(remoteStream2.getAudioTracks()).to.have.length(stream.getAudioTracks().length);

      expect(remoteStream1.getVideoTracks()).to.have.length(stream.getVideoTracks().length);
      expect(remoteStream2.getVideoTracks()).to.have.length(stream.getVideoTracks().length);
      done();
    }, 3500);
  });

  it.skip('RTCPeerConnection.onremovestream :: emit', function () {});



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