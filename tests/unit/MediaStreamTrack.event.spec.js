//mocha.bail();
//mocha.run();

var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;

// Test timeouts
var testTimeout = 35000;

// Get User Media timeout
var gUMTimeout = 25000;

// Test item timeout
var testItemTimeout = 2000;


describe('MediaStreamTrack | EventHandler', function() {
	this.timeout(testTimeout);

	/* Attributes */
	var stream = null;
	var track = null;


	/* Get User Media */
	beforeEach(function (done) {
		this.slow(1000);
		this.timeout(gUMTimeout + 1000);

		if (window.webrtcDetectedBrowser !== 'IE' && window.webrtcDetectedBrowser !== 'Safari') {
			AdapterJS.onwebrtcreadyDone = true;
		}

		var getMedia = function () {
			window.getUserMedia({
				audio: true,
				video: true

			}, function (data) {
				stream = data;
				track = data.polygetAudioTracks()[0];

				done();

			}, function (error) {
				throw error;
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

		var hasTriggered = false;

		track.onended = function () {
		  done();
		};

		track.polystop();
	});

	it('MediaStreamTrack.onended :: emit < When > MediaStream.polystop()', function (done) {
		this.timeout(testItemTimeout);

		var i, j;

		var audioEndedTriggered = 0;
		var videoEndedTriggered = 0;

		var audioTracks = stream.polygetAudioTracks();
		var videoTracks = stream.polygetVideoTracks();

		var audioTriggeredFn = function () {
			audioEndedTriggered += 1;
		};

		var videoTriggeredFn = function () {
			videoEndedTriggered += 1;
		};

		for (i = 0; i < audioTracks.length; i += 1) {
			audioTracks[i].onended = audioTriggeredFn;
		}

		for (j = 0; j < videoTracks.length; j += 1) {
			videoTracks[j].onended = videoTriggeredFn;
		}

		stream.polystop();

		setTimeout(function () {
			expect(audioEndedTriggered).to.equal(audioTracks.length);
			expect(videoEndedTriggered).to.equal(videoTracks.length);
			done();
		}, 1000);
	});
});