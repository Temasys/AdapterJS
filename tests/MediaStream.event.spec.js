//mocha.bail();
//mocha.run();

var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;

var slowTimeout = window.webrtcDetectedBrowser === 'safari' || window.webrtcDetectedBrowser === 'IE' ? 5000 : 1;


describe('MediaStream: Events', function() {
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
		this.timeout(15000);

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

	it('.onremovetrack', function (done) {
		stream.onremovetrack = function (event) {
			assert.ok(event, 'Triggers when removeTrack() is invoked');
			done();
		};

		catchFn(function () {
			stream.removeTrack(track);
		}, done);
	});

	it('.onaddtrack', function (done) {
		stream.onaddtrack = function (event) {
			assert.ok(event, 'Triggers when addTrack() is invoked');
			done();
		};

		catchFn(function () {
			stream.addTrack(track);
		}, done);
	});

	it('.onended', function (done) {
		stream.onended = function (event) {
			assert.ok(event, 'Triggers when stop() is invoked');
			done();
		};

		catchFn(function () {
			stream.stop();
		}, done);
	});
});