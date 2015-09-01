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

// typeof webrtcObjectFunction
// Init in before
// Equals 'object' if IE + plugin
// Equals 'function' otherwise
var FUNCTION_TYPE = null;

describe('MediaStreamTrack | Properties', function() {
	this.timeout(testTimeout);

	/* Attributes */
	var stream = null;
	var audioTrack = null;
	var videoTrack = null;

	/* WebRTC Object should be initialized in Safari/IE Plugin */
	before(function (done) {
		this.timeout(testItemTimeout + gUMTimeout);

		AdapterJS.webRTCReady(function() {
			FUNCTION_TYPE = webrtcDetectedBrowser === 'IE' ? 'object' : 'function';

			window.navigator.getUserMedia({
				audio: true,
				video: true

			}, function (data) {
				stream = data;
				videoTrack = stream.getVideoTracks()[0];
				audioTrack = stream.getAudioTracks()[0];
				done();

			}, function (error) {
				throw error;
				done();
			});
		});
	});

	it('MediaStreamTrack.getSources :: static method', function (done) {
		this.timeout(testItemTimeout);

		assert.typeOf(MediaStreamTrack.getSources, FUNCTION_TYPE);

		MediaStreamTrack.getSources(function (sources) {
			expect(sources.length).to.be.at.least(1);

			var source1 = sources[0];

			assert.typeOf(source1.id, 'string');
			assert.typeOf(source1.kind, 'string');
			assert.typeOf(source1.facing, 'string');
			assert.typeOf(source1.label, 'string');

			var constraints = {};

			constraints[source1.kind] = {
				optional: [{ sourceId: source1.id }]
			};

			window.navigator.getUserMedia(constraints, function (checkStream) {

				var checkTrack = source1.kind === 'audio' ? checkStream.getAudioTracks()[0] :
					checkStream.getVideoTracks()[0];

				expect(checkTrack.id).to.equal(source1.id);
				done();

			}, function (error) {
				throw error;
			});
		});
	});

	it('MediaStreamTrack.id :: string', function () {
		this.timeout(testItemTimeout);

		assert.typeOf(audioTrack.id, 'string');
		assert.typeOf(videoTrack.id, 'string');

		expect(audioTrack.id).to.not.equal(videoTrack.id);
	});

	it('MediaStreamTrack.ended :: boolean', function () {
		this.timeout(testItemTimeout);

		assert.typeOf(audioTrack.ended, 'boolean');
		assert.typeOf(videoTrack.ended, 'boolean');

		expect(audioTrack.ended).to.equal(false);
		expect(videoTrack.ended).to.equal(false);
	});

	it('MediaStreamTrack.remote :: boolean', function () {
		this.timeout(testItemTimeout);

		assert.typeOf(audioTrack.remote, 'boolean');
		assert.typeOf(videoTrack.remote, 'boolean');

		expect(audioTrack.remote).to.equal(false);
		expect(videoTrack.remote).to.equal(false);
	});

	it('MediaStreamTrack.readyState :: string', function () {
		this.timeout(testItemTimeout);

		assert.typeOf(audioTrack.readyState, 'string');
		assert.typeOf(videoTrack.readyState, 'string');

		expect(audioTrack.readyState).to.equal('live');
		expect(videoTrack.readyState).to.equal('live');
	});

	it('MediaStreamTrack.enabled :: boolean', function () {
		this.timeout(testItemTimeout);

		assert.typeOf(audioTrack.enabled, 'boolean');
		assert.typeOf(videoTrack.enabled, 'boolean');

		expect(audioTrack.enabled).to.equal(true);
		expect(videoTrack.enabled).to.equal(true);

		audioTrack.enabled = false;
		videoTrack.enabled = false;

		expect(audioTrack.enabled).to.equal(false);
		expect(videoTrack.enabled).to.equal(false);
	});

	it('MediaStreamTrack.muted :: boolean', function () {
		this.timeout(testItemTimeout);

		assert.typeOf(audioTrack.muted, 'boolean');
		assert.typeOf(videoTrack.muted, 'boolean');

		expect(audioTrack.muted).to.equal(false);
		expect(videoTrack.muted).to.equal(false);
	});

	it('MediaStreamTrack.kind :: string', function () {
		this.timeout(testItemTimeout);

		assert.typeOf(audioTrack.kind, 'string');
		assert.typeOf(videoTrack.kind, 'string');

		expect(audioTrack.kind).to.equal('audio');
		expect(videoTrack.kind).to.equal('video');
	});

	it('MediaStreamTrack.readOnly :: boolean', function () {
		this.timeout(testItemTimeout);

		assert.typeOf(audioTrack.readOnly, 'boolean');
		assert.typeOf(videoTrack.readOnly, 'boolean');
	});

	it('MediaStreamTrack.label :: string', function () {
		this.timeout(testItemTimeout);

		assert.typeOf(audioTrack.label, 'string');
		assert.typeOf(videoTrack.label, 'string');

		expect(audioTrack.label).to.not.equal('');
		expect(videoTrack.label).to.not.equal('');
	});

	it('MediaStreamTrack.getConstraints :: method', function () {
		this.timeout(testItemTimeout);

		assert.typeOf(videoTrack.getConstraints, FUNCTION_TYPE);

		var data = videoTrack.getConstraints();
		assert.typeOf(data, 'object');
	});

	it('MediaStreamTrack.applyConstraints :: method', function () {
		this.timeout(testItemTimeout);

		assert.typeOf(videoTrack.applyConstraints, FUNCTION_TYPE);

		var newConstraints = {
			mandantory: {
				maxHeight: 500
			}
		};

		videoTrack.applyConstraints(newConstraints);
		expect(videoTrack.getConstraints()).to.equal(newConstraints);
	});

	it('MediaStreamTrack.getSettings :: method', function () {
		this.timeout(testItemTimeout);

		assert.typeOf(track.getSettings, FUNCTION_TYPE);

		var check = videoTrack.getSettings();
		assert.typeOf(check.facing, 'string');
		assert.typeOf(check.frameRate, 'number');
	});

	it('MediaStreamTrack.states :: method', function () {
		this.timeout(testItemTimeout);

		assert.typeOf(videoTrack.states, FUNCTION_TYPE);
		assert.typeOf(audioTrack.states, FUNCTION_TYPE);

		assert.typeOf(videoTrack.states(), 'object');
		assert.typeOf(audioTrack.states(), 'object');
	});

	it('MediaStreamTrack.clone :: method', function () {
		this.timeout(testItemTimeout);

		assert.typeOf(audioTrack.clone, FUNCTION_TYPE);
		assert.typeOf(videoTrack.clone, FUNCTION_TYPE);

		var clone = audioTrack.clone();
		assert.typeOf(clone, 'object');

		expect(audioTrack.id).to.not.equal(clone.id);
		expect(audioTrack.kind).to.equal(clone.kind);
		expect(audioTrack.label).to.equal(clone.label);
	});

	it('MediaStreamTrack.stop -> MediaStreamTrack.stop :: method', function (done) {
		this.timeout(testItemTimeout);

		assert.typeOf(audioTrack.stop, FUNCTION_TYPE);
		assert.typeOf(videoTrack.stop, FUNCTION_TYPE);

		audioTrack.stop();
		videoTrack.stop();

		setTimeout(function () {
			expect(audioTrack.ended).to.equal(true);
			expect(videoTrack.ended).to.equal(true);

			expect(audioTrack.readyState).to.equal('ended');
			expect(videoTrack.readyState).to.equal('ended');
			done();
		}, 1500);
	});
});