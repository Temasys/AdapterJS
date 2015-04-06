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


describe('MediaStreamTrack | EventHandler', function() {
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
				track = stream.polygetAudioTracks()[0];
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

	it.skip('MediaStreamTrack.onstarted :: emit', function () {});

	it.skip('MediaStreamTrack.onmute :: emit', function () {});

	it.skip('MediaStreamTrack.onunmute :: emit', function () {});

	it.skip('MediaStreamTrack.onoverconstrained :: emit', function () {});

	it('MediaStreamTrack.onended :: emit < When > MediaStreamTrack.polystop()', function (done) {
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

	it('MediaStreamTrack.onended :: emit < When > MediaStream.polystop()', function (done) {
		this.timeout(gUMTimeout + testItemTimeout + 8000);

		window.navigator.getUserMedia({
			audio: true,
			video: true

		}, function (data) {
			stream = data;

			var i, j;

			var audioEndedTriggered = 0;
			var videoEndedTriggered = 0;

			var audioTracks = stream.polygetAudioTracks();
			var videoTracks = stream.polygetVideoTracks();

			for (i = 0; i < audioTracks.length; i += 1) {
				audioTracks[i].onended = function () {
					audioEndedTriggered += 1;
				};
			}

			for (j = 0; j < videoTracks.length; j += 1) {
				videoTracks[j].onended = function () {
					videoEndedTriggered += 1;
				};
			}

			stream.polystop();

			setTimeout(function () {

				(audioEndedTriggered + videoEndedTriggered).should.equal(audioTracks.length + videoTracks.length);

				done();

			}, 8000);

		}, function (error) {
			throw error;
			done();
		});

	});
});