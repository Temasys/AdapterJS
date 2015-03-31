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


describe('MediaStreamTrack | EventHandler', function() {
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

	it.skip('MediaStreamTrack.onstarted :: emit', function () {});

	it.skip('MediaStreamTrack.onmute :: emit', function () {});

	it.skip('MediaStreamTrack.onunmute :: emit', function () {});

	it.skip('MediaStreamTrack.onoverconstrained :: emit', function () {});

	it('MediaStreamTrack.onended :: emit', function (done) {
		this.timeout(testItemTimeout);

		track.onended = function (event) {
			assert.ok(event, 'Triggers when stop() is invoked');
			done();
		};

		try {
			track.polystop();
			done();

		} catch (error) {
			throw error;
			done();
		}
	});
});