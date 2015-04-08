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
			window.navigator.getUserMedia({
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

		MediaStreamTrack.getSources(function (sources) {
			expect(sources.length).to.be.at.least(1);
			done();
		});
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
		expect(track.readyState).to.equal('live');
	});

	it('MediaStreamTrack.enabled :: boolean', function () {
		this.timeout(testItemTimeout);

		assert.typeOf(track.enabled, 'boolean');
		expect(track.enabled).to.equal(true);
	});

	it('MediaStreamTrack.muted :: boolean', function () {
		this.timeout(testItemTimeout);

		assert.typeOf(track.muted, 'boolean');
		expect(track.muted).to.equal(false);
	});

	it('MediaStreamTrack.kind :: string', function () {
		this.timeout(testItemTimeout);

		assert.typeOf(track.kind, 'string');
		expect(track.kind).to.equal('video');
		// get audio
		expect(stream.polygetAudioTracks()[0].kind).to.equal('audio');
	});

	it('MediaStreamTrack.readOnly :: boolean', function () {
		assert.typeOf(track.readOnly, 'boolean');
	});

	it('MediaStreamTrack.label :: string', function () {
		this.timeout(testItemTimeout);

		assert.typeOf(track.label, 'string');
	});

	it('MediaStreamTrack.getConstraints :: method', function () {
		this.timeout(testItemTimeout);

		assert.typeOf(track.getConstraints, 'function');

		var data = track.getConstraints();
		assert.typeOf(data, 'object');
	});

	it('MediaStreamTrack.applyConstraints :: method', function () {
		this.timeout(testItemTimeout);

		assert.typeOf(track.applyConstraints, 'function');

		var newConstraints = {
			mandantory: {
				maxHeight: 500
			}
		};

		track.applyConstraints(newConstraints);
		expect(track.getConstraints()).to.equal(newConstraints);
	});

	it('MediaStreamTrack.getSettings :: method', function () {
		this.timeout(testItemTimeout);

		assert.typeOf(track.getSettings, 'function');

		var check = track.getSettings();
		assert.typeOf(check.facing, 'string');
		assert.typeOf(check.frameRate, 'number');
	});

	it('MediaStreamTrack.states :: method', function () {
		this.timeout(testItemTimeout);

		assert.typeOf(track.states, 'function');

		assert.typeOf(track.states(), 'object');
	});

	it('MediaStreamTrack.clone :: method', function () {
		this.timeout(testItemTimeout);

		assert.typeOf(track.clone, 'function');

		var clone = track.clone();
		assert.typeOf(clone, 'object');
	});

	it('MediaStreamTrack.polystop -> MediaStreamTrack.stop :: method', function (done) {
		this.timeout(testItemTimeout);

		assert.typeOf(track.polystop, 'function');

		track.polystop();

		setTimeout(function () {
			expect(track.ended).to.equal(true);
			done();
		}, 1500);
	});
});