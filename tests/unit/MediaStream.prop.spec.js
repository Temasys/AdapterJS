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

describe('MediaStream | Properties', function() {
	this.timeout(testTimeout);

	/* Attributes */
	var stream = null;
	var track = null;

	var checkRemoveTrackSuccess = false;

	/* WebRTC Object should be initialized in Safari/IE Plugin */
	before(function (done) {
		FUNCTION_TYPE = webrtcDetectedBrowser === 'IE' ? 'object' : 'function';

		this.timeout(testItemTimeout);

		AdapterJS.webRTCReady(function() {
			done();
		});
	});

	/* Get User Media */
	beforeEach(function (done) {
		this.timeout(gUMTimeout);

		window.navigator.getUserMedia({
			audio: true,
			video: true
		}, function (data) {
			stream = data;
			track = data.getAudioTracks()[0];
			done();
		}, function (error) {
			throw error;
		});
	});

  afterEach(function() {
		stream.stop();
		stream = null;
		track = null;
  });

	it('MediaStream.id :: string', function (done) {
		this.timeout(testItemTimeout);

		assert.typeOf(stream.id, 'string');

		var regex = /^[\u0021\u0023-\u0027\u002A-\u002B\u002D-\u002E\u0030-\u0039\u0041-\u005A\u005E-\u007E]*$/;

		expect(stream.id).to.have.length(36);
		expect(stream.id).to.match(regex);

		done();
	});

	it('MediaStream.ended :: boolean', function (done) {
		this.timeout(testItemTimeout);

		assert.typeOf(stream.ended, 'boolean')

		done();
	});

	it('MediaStream.clone :: method', function (done) {
		this.timeout(testItemTimeout);

		assert.typeOf(stream.clone, FUNCTION_TYPE);

		var clone = stream.clone();
		assert.typeOf(clone, 'object');

		done();
	});

	it('MediaStream.removeTrack -> MediaStream.removeTrack :: method', function (done) {
		this.timeout(testItemTimeout);

		assert.equal(typeof stream.removeTrack, FUNCTION_TYPE);

		stream.removeTrack(track);

		checkRemoveTrackSuccess = stream.getAudioTracks().length === 0;

		expect(stream.getAudioTracks()).to.have.length(0);

		done();
	});

	it('MediaStream.addTrack -> MediaStream.addTrack :: method', function (done) {
		this.timeout(testItemTimeout);

		assert.equal(typeof stream.addTrack, FUNCTION_TYPE);

		stream.addTrack(track);

		if (!checkRemoveTrackSuccess) {
			throw new Error('Remove track failed. Unable to proceed checking of addTrack');
		}

		expect(stream.getAudioTracks()).to.have.length(1);

		done();
	});

	it('MediaStream.getTrackById -> MediaStream.getTrackById :: method', function (done) {
		this.timeout(testItemTimeout);

		assert.equal(typeof stream.getTrackById, FUNCTION_TYPE);

		var check = stream.getTrackById(track.id);

		expect(check.id).to.equal(track.id);

		done();
	});

	it('MediaStream.getTracks -> MediaStream.getTracks :: method', function (done) {
		this.timeout(testItemTimeout);

		assert.equal(typeof stream.getTracks, FUNCTION_TYPE);

		var tracks = stream.getTracks(track.id);

		if (!(tracks instanceof Array)) {
			throw new Error('Received track type is not an array');
		}

		expect(tracks).to.have.length(2);

		done();
	});

	it('MediaStream.stop -> MediaStream.stop :: method', function (done) {
		this.timeout(testItemTimeout + 2500);

		assert.equal(typeof stream.stop, FUNCTION_TYPE);

		stream.stop();

		setTimeout(function () {
			expect(stream.ended).to.equal(true);
			done();
		}, 2500);
	});

	it('MediaStream.addTrack && MediaStream.removeTrack -> Error < When > MediaStream.ended === true', function (done) {
		this.timeout(testItemTimeout);

		expect(function () {
			stream.addTrack(track);
		}).to.throw(Error);

		expect(function () {
			stream.removeTrack(track);
		}).to.throw(Error);

		done();
	});
});