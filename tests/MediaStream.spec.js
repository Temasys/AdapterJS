//mocha.bail();
//mocha.run();

var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;

var slowTimeout = window.webrtcDetectedBrowser === 'safari' || window.webrtcDetectedBrowser === 'IE' ? 5000 : 1;


describe('MediaStream: Properties', function() {
	this.slow(slowTimeout);

	var stream = null;
	var track = null;

	var catchFn = function (code, done) {
		try {
			return code();
		} catch (error) {
			throw error;
			done();
		}
	};

	before(function (done) {
		window.getUserMedia({
			audio: true,
			video: true
		}, function (data) {
			stream = data;
			track = stream.getAudioTracks()[0];
			done();
		}, function (error) {
			throw error;
			done();
		});
	});

	it('.id : string', function () {
		assert.typeOf(stream.id, 'string');
	});

	it('.ended : boolean', function () {
		assert.typeOf(stream.ended, 'boolean')
	});

	it('.clone ()', function (done) {
		assert.typeOf(stream.clone, 'function');

		catchFn(function () {
			var clone = stream.clone();
			assert.typeOf(clone, 'object');
			done();
		}, done);
	});

	it('.removeTrack ()', function (done) {
		assert.typeOf(stream.removeTrack, 'function');

		catchFn(function () {
			stream.removeTrack(track);
			stream.getAudioTracks().length.should.equal(0);
			done();
		}, done);
	});

	it('.addTrack ()', function (done) {
		assert.typeOf(stream.addTrack, 'function');

		catchFn(function () {
			stream.addTrack(track);
			stream.getAudioTracks().length.should.equal(1);
			done();
		}, done);
	});

	it('.getTrackById ()', function (done) {
		assert.typeOf(stream.getTrackById, 'function');

		catchFn(function () {
			var check = stream.getTrackById(track.id);
			check.should.equal(track);
			done();
		}, done);
	});

	it('.stop ()', function (done) {
		assert.typeOf(stream.stop, 'function');

		catchFn(function () {
			stream.stop();
			stream.ended.should.equal(true);
			done();
		}, done);
	});
});