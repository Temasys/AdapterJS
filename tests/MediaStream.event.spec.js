//mocha.bail();
//mocha.run();

var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;

// Test timeouts
var testTimeout = window.webrtcDetectedBrowser === 'safari' || window.webrtcDetectedBrowser === 'IE' ? 5000 : 1;

// Get User Media timeout
var gUMTimeout = 8000;

// Test item timeout
var testItemTimeout = 4000;


describe('MediaStream | EventHandler', function() {
	this.slow(testTimeout);

	/* Attributes */
	var stream = null;
	var track = null;

	/* Get User Media */
	before(function (done) {
		this.timeout(gUMTimeout);

		window.getUserMedia({
			audio: true,
			video: true

		}, function (data) {
			stream = data;
			track = stream.polygetAudioTracks()[0];
			done();

		}, function (error) {
			throw error;
			done();
		});
	});

	it('MediaStream.onremovetrack :: emit', function (done) {
		this.timeout(testItemTimeout);

		stream.onremovetrack = function (event) {
			assert.ok(event, 'Triggers when removeTrack() is invoked');
			done();
		};

		try {
			stream.polyremoveTrack(track);

		} catch (error) {
			throw error;
			done();
		}
	});

	it('MediaStream.onaddtrack :: emit', function (done) {
		this.timeout(testItemTimeout);

		stream.onaddtrack = function (event) {
			assert.ok(event, 'Triggers when addTrack() is invoked');
			done();
		};

		try {
			stream.polyaddTrack(track);

		} catch (error) {
			throw error;
			done();
		}
	});

	it('MediaStream.onended :: emit', function (done) {
		this.timeout(testItemTimeout);

		stream.onended = function (event) {
			var checkEvent = window.webrtcDetectedBrowser === 'safari' || window.webrtcDetectedBrowser === 'IE' ?
				{} : event;
			assert.ok(checkEvent, 'Triggers when stop() is invoked');
			done();
		};

		try {
			stream.polystop();

		} catch (error) {
			throw error;
			done();
		}
	});
});