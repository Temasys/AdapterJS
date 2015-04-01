//mocha.bail();
//mocha.run();

var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;

// Test timeouts
var testTimeout = 25000;

// Get User Media timeout
var gUMTimeout = 15000;

// Test item timeout
var testItemTimeout = 4000;


describe('MediaStreamTrack | Properties', function() {
	this.timeout(testTimeout);

	/* Attributes */
	var stream = null;
	var track = null;

	/* Get User Media */
	before(function (done) {
		this.timeout(gUMTimeout);

		if (window.webrtcDetectedBrowser !== 'IE' && window.webrtcDetectedBrowser !== 'Safari') {
			AdapterJS.onwebrtcreadyDone = true;
		}

		var getMedia = function () {
			window.getUserMedia({
				audio: true,
				video: true

			}, function (data) {
				stream = data;
				track = stream.polygetVideoTracks()[0];
				done();

			}, function (error) {
				throw error;
				done();
			});
		};

		if (!AdapterJS.onwebrtcreadyDone) {
			AdapterJS.onwebrtcready = getMedia;

		} else {
			getMedia();
		}
	});

	it('MediaStreamTrack.getSources :: static method', function (done) {
		this.timeout(testItemTimeout);

		assert.typeOf(MediaStreamTrack.getSources, 'function');

		try {
			MediaStreamTrack.getSources(function (sources) {
				sources.length.should.least(1);
				done();
			});

		} catch (error) {
			throw error;
			done();
		}
	});

	it('MediaStreamTrack.id :: string', function () {
		this.timeout(testItemTimeout);

		assert.typeOf(track.id, 'string');
	});

	it('MediaStreamTrack.ended :: boolean', function () {
		this.timeout(testItemTimeout);

		assert.typeOf(track.ended, 'boolean')
	});

	it('MediaStreamTrack.remote :: boolean', function () {
		this.timeout(testItemTimeout);

		assert.typeOf(track.remote, 'boolean')
	});

	it('MediaStreamTrack.readyState :: string', function () {
		this.timeout(testItemTimeout);

		assert.typeOf(track.readyState, 'string');
		track.readyState.should.equal('live');
	});

	it('MediaStreamTrack.enabled :: boolean', function () {
		this.timeout(testItemTimeout);

		assert.typeOf(track.enabled, 'boolean');
		track.enabled.should.equal(true);
	});

	it('MediaStreamTrack.muted :: boolean', function () {
		this.timeout(testItemTimeout);

		assert.typeOf(track.muted, 'boolean');
		track.muted.should.equal(false);
	});

	it('MediaStreamTrack.kind :: string', function () {
		this.timeout(testItemTimeout);

		assert.typeOf(track.kind, 'string');
		track.kind.should.equal('video');
		// get audio
		stream.polygetAudioTracks()[0].kind.should.equal('audio');
	});

	it('MediaStreamTrack.readOnly :: boolean', function () {
		assert.typeOf(track.readOnly, 'boolean');
	});

	it('MediaStreamTrack.label :: string', function () {
		this.timeout(testItemTimeout);

		assert.typeOf(track.label, 'string');
	});

	it('MediaStreamTrack.getConstraints :: method', function (done) {
		this.timeout(testItemTimeout);

		assert.typeOf(track.getConstraints, 'function');

		try {
			var data = track.getConstraints();
			assert.typeOf(data, 'object');
			done();

		} catch (error) {
			throw error;
			done();
		}
	});

	it('MediaStreamTrack.applyConstraints :: method', function (done) {
		this.timeout(testItemTimeout);

		assert.typeOf(track.applyConstraints, 'function');

		var newConstraints = {
			mandantory: {
				maxHeight: 500
			}
		};

		try {
			track.applyConstraints(newConstraints);
			track.getConstraints().should.equal(newConstraints);
			done();

		} catch (error) {
			throw error;
			done();
		}
	});

	it('MediaStreamTrack.getSettings :: method', function (done) {
		this.timeout(testItemTimeout);

		assert.typeOf(track.getSettings, 'function');

		try {
			var check = track.getSettings();
			assert.typeOf(check.facing, 'string');
			assert.typeOf(check.frameRate, 'number');
			done();

		} catch (error) {
			throw error;
			done();
		}
	});

	it('MediaStreamTrack.states :: method', function (done) {
		this.timeout(testItemTimeout);

		assert.typeOf(track.states, 'function');

		try {
			assert.typeOf(track.states(), 'object');
			done();

		} catch (error) {
			throw error;
			done();
		}
	});

	it('MediaStreamTrack.clone :: method', function (done) {
		this.timeout(testItemTimeout);

		assert.typeOf(track.clone, 'function');

		try {
			var clone = track.clone();
			assert.typeOf(clone, 'object');
			done();

		} catch (error) {
			throw error;
			done();
		}
	});

	it('MediaStreamTrack.polystop -> MediaStreamTrack.stop :: method', function (done) {
		this.timeout(testItemTimeout);

		assert.typeOf(track.polystop, 'function');

		try {
			track.polystop();

			setTimeout(function () {
				track.ended.should.equal(true);
				done();
			}, 1500);

		} catch (error) {
			throw error;
			done();
		}
	});
});