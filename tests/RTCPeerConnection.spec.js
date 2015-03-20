//mocha.bail();
//mocha.run();

var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;

var slowTimeout = window.webrtcDetectedBrowser === 'safari' || window.webrtcDetectedBrowser === 'IE' ? 5000 : 1;


describe('RTCPeerConnection: Properties', function() {
	this.slow(slowTimeout);

	var stream = null;
	var peer = null;
	var peer2 = null;
	var offer;
	var answer;

	var candidates = [];
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
    Promise<RTCSessionDescription> createOffer (optional RTCOfferOptions options);
    Promise<RTCSessionDescription> createAnswer ();
    Promise<void>                  setLocalDescription (RTCSessionDescription description);
    Promise<void>                  setRemoteDescription (RTCSessionDescription description);
    Promise<void>                  addIceCandidate (RTCIceCandidate candidate);
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
			var result = peer.getStreamById(stream.id)
			result.should.equal(stream);
		}, done);
	});

	it('.createOffer ()', function (done) {
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

	it('.setLocalDescription ()', function (done) {
		assert.typeOf(peer.setLocalDescription, 'function');

		catchFn(function () {
			peer.setLocalDescription(offer, function () {
				assert.ok(null, null, 'setLocalDescription success');
			}, done);
			done();
		}, done);
	});

	it('.stop () = .polystop ()', function (done) {
		this.timeout(4000);

		assert.typeOf(track.polystop, 'function');

		catchFn(function () {
			track.polystop();
			setTimeout(function () {
				track.ended.should.equal(true);
				done();
			}, 3000);
		}, done);
	});
});