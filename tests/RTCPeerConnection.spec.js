//mocha.bail();
//mocha.run();

var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;

var slowTimeout = window.webrtcDetectedBrowser === 'safari' || window.webrtcDetectedBrowser === 'IE' ? 10000 : 1;


describe('RTCPeerConnection: Properties', function() {
	this.slow(slowTimeout);

	var stream = null;
	var peer = null;
	var peer2 = null;
	var offer;
	var answer;

	var candidates = [];
	var candidates2 = [];
	var ready = false;

	var catchFn = function (code, done) {
		try {
			return code();
		} catch (error) {
			throw error;
			done();
		}
	};

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

	before(function (done) {
		this.timeout(15000);

		peer = new RTCPeerConnection(null);
		peer2 = new RTCPeerConnection(null);

		peer.onicecandidate = function (event) {
			candidates.push(event.candidate || event);
		};

		peer.onicegatheringstatechange = function () {
			ready = peer.iceGatheringState === 'complete';
		};

		peer2.onicecandidate = function (event) {
			candidates2.push(event.candidate || event);
		};
	});

	it('.localDescription : object - should be null', function () {
		peer.localDescription.should.equal(null);
	});

	it('.remoteDescription : object - should be null', function () {
		peer.remoteDescription.should.equal(null);
	});

	it('.signalingState : string - should be "stable"', function () {
		peer.signalingState.should.equal('stable');
	});

	it('.iceConnectionState : string - should be "new"', function () {
		peer.iceConnectionState.should.equal('new');
	});

	it('.iceGatheringState : string - should be "new"', function () {
		peer.iceGatheringState.should.equal('new');
	});

	it('.canTrickleIceCandidates : boolean', function () {
		assert.typeOf(peer.canTrickleIceCandidates, 'boolean');
	});

	it('.getLocalStreams ()', function (done) {
		assert.typeOf(peer.getLocalStreams, 'function');

		catchFn(function () {
			var result = peer.getLocalStreams();
			assert.instanceOf(result, Array);
		}, done);
	});

	it('.getRemoteStreams ()', function (done) {
		assert.typeOf(peer.getRemoteStreams, 'function');

		catchFn(function () {
			var result = peer.getRemoteStreams();
			assert.instanceOf(result, Array);
		}, done);
	});

	it('.addStream ()', function (done) {
		assert.typeOf(peer.addStream, 'function');

		window.getUserMedia({
			audio: true,
			video: true
		}, function (data) {
			stream = data;

			catchFn(function () {
				peer.addStream(stream);

				setTimeout(function () {
					peer.getLocalStreams().length.should.equal(1);
					done();
				}, 1000);
			}, done);
		}, done);
	});

	it('.removeStream ()', function (done) {
		assert.typeOf(peer.removeStream, 'function');

		catchFn(function () {
			peer.removeStream(stream);

			setTimeout(function () {
				peer.getLocalStreams().length.should.equal(0);
				done();
			}, 1000);
		}, done);
	});

	it('.getConfiguration ()', function (done) {
		assert.typeOf(peer.getConfiguration, 'function');

		catchFn(function () {
			var data = peer.getConfiguration();
			assert.typeOf(data, 'object');
			done();
		}, done);
	});

	it('.updateIce ()', function (done) {
		assert.typeOf(peer.updateIce, 'function');

		// at this point, check if constraints are correct
		/*catchFn(function () {
			track.applyConstraints(newConstraints);
			track.getConstraints().should.equal(newConstraints);
			done();
		}, done);*/
	});

	it('.getStreamById ()', function (done) {
		assert.typeOf(peer.getStreamById, 'function');

		peer.addStream(stream);

		catchFn(function () {
			var result = peer.getStreamById(stream.id);
			result.should.equal(stream);
		}, done);
	});

	it('.createDataChannel ()', function (done) {
		assert.typeOf(peer.createDataChannel, 'function');

		catchFn(function () {
			var channel = peer.createDataChannel('Test');
			assert.typeOf(channel, 'object');
			channel.label.should.equal('Test');
			done();
		}, done);
	});

	it('.createDTMFSender ()', function (done) {
		assert.typeOf(peer.createDTMFSender, 'function');

		catchFn(function () {
			var track = stream.getAudioTracks()[0];
			var sender = peer.createDTMFSender(track);
			assert.typeOf(sender, 'object');
			sender.track.should.equal(track);
			done();
		}, done);
	});

	it('.createOffer () -> offer', function (done) {
		assert.typeOf(peer.createOffer, 'function');

		catchFn(function () {
			peer.createOffer(function (sdp) {
				offer = sdp;
				sdp.type.should.equal('offer');
				assert.typeOf(sdp.sdp, 'string');
				done();
			}, done);
		}, done);
	});

	it('.setLocalDescription () -> offer', function (done) {
		assert.typeOf(peer.setLocalDescription, 'function');

		catchFn(function () {
			peer.setLocalDescription(offer, function () {
				assert.ok(null, null, 'setLocalDescription (offer) success');
			}, done);
			done();
		}, done);
	});

	it('.setRemoteDescription () -> offer', function (done) {
		assert.typeOf(peer2.setRemoteDescription, 'function');

		catchFn(function () {
			peer2.setRemoteDescription(offer, function () {
				assert.ok(null, null, 'setRemoteDescription (offer) success');
			}, done);
			done();
		}, done);
	});

	it('.createAnswer () -> answer', function (done) {
		assert.typeOf(peer2.createAnswer, 'function');

		catchFn(function () {
			peer2.createAnswer(function (sdp) {
				answer = sdp;
				sdp.type.should.equal('answer');
				assert.typeOf(sdp.sdp, 'string');
				done();
			}, done);
		}, done);
	});

	it('.setLocalDescription () -> answer', function (done) {
		assert.typeOf(peer2.setLocalDescription, 'function');

		catchFn(function () {
			peer2.setLocalDescription(answer, function () {
				assert.ok(null, null, 'setLocalDescription (answer) success');
			}, done);
			done();
		}, done);
	});

	it('.setRemoteDescription () -> answer', function (done) {
		assert.typeOf(peer.setRemoteDescription, 'function');

		catchFn(function () {
			peer.setRemoteDescription(answer, function () {
				assert.ok(null, null, 'setRemoteDescription (answer) success');
			}, done);
			done();
		}, done);
	});

	it('.addIceCandidate ()', function (done) {
		this.timeout(8000);

		assert.typeOf(peer.setRemoteDescription, 'function');

		catchFn(function () {
			// Without callbacks
			peer.addIceCandidate(candidates2[0]);

			setTimeout(function () {
				assert.ok(null, null, 'addIceCandidate can be called without callbacks');

				// With callbacks
				peer2.addIceCandidate(candidates[0], function () {
					assert.ok(null, null, 'addIceCandidate added successfully triggers success callback');
				}, function (error) {
					assert.instanceOf(error, Error);
					assert.ok(null, null, 'addIceCandidate added failure triggers failure callback');
				});

				var checkerFn = setInterval(function () {
					if (ready === true) {
						clearInterval(checkerFn);
						clearTimeout(timeoutFn);
						candidates[candidates.length - 1].candidate.should.equal(null);

						var i, j;

						for (i = 1; i < candidates.length - 1; i += 1) {
							peer2.addIceCandidate(candidates[i]);
						}

						for (j = 1; j < candidates2.length - 1; j += 1) {
							peer.addIceCandidate(candidates2[j]);
						}

						done();
					}
				}, 1000);

				var timeoutFn = setTimeout(function () {
					done();
				}, 5000);
			}, 100);
		}, done);
	});

	it('.close ()', function (done) {
		this.timeout(4000);

		assert.typeOf(peer.close, 'function');

		catchFn(function () {
			peer.close();
			setTimeout(function () {
				peer.signalingState.should.equal('closed');
				peer.iceConnectionState.should.equal('closed');
				done();
			}, 3000);
		}, done);
	});
});