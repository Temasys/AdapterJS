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


describe('MediaStream | EventHandler', function() {
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

	it('MediaStream.onremovetrack :: emit', function (done) {
		this.timeout(testItemTimeout);

		stream.onremovetrack = function (event) {
			assert.ok(event, 'Triggers when polyremoveTrack() is invoked');
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
			assert.ok(event, 'Triggers when polyaddTrack() is invoked');
			done();
		};

		try {
			stream.polyaddTrack(track);

		} catch (error) {
			throw error;
			done();
		}
	});

	it('MediaStream.onended :: emit < When > MediaStream.polystop()', function (done) {
		this.timeout(testItemTimeout);

		stream.onended = function (event) {
			var checkEvent = window.webrtcDetectedBrowser === 'safari' || window.webrtcDetectedBrowser === 'IE' ?
				{} : event;
			assert.ok(checkEvent, 'Triggers when polystop() is invoked');
			done();
		};

		try {
			stream.polystop();

		} catch (error) {
			throw error;
			done();
		}
	});

	it('MediaStream.onended :: emit < When > for MediaStreamTrack in MediaStream >> MediaStreamTrack.polystop()', function (done) {
		this.timeout(testItemTimeout + gUMTimeout + 4000);

		window.navigator.getUserMedia({
			audio: true,
			video: true

		}, function (data) {
			var ucStream = data;

			ucStream.onended = function (event) {
				var checkEvent = window.webrtcDetectedBrowser === 'safari' || window.webrtcDetectedBrowser === 'IE' ?
					{} : event;
				assert.ok(checkEvent, 'Triggers when all MediaStreamTracks polystop() is invoked');
				done();
			};

			try {
				var i, j;

				var audioTracks = ucStream.polygetAudioTracks();
				var videoTracks = ucStream.polygetVideoTracks();

				for (i = 0; i < audioTracks.length; i += 1) {
					audioTracks[i].polystop();
				}

				for (j = 0; j < videoTracks.length; j += 1) {
					videoTracks[j].polystop();
				}

			} catch (error) {
				throw error;
				done();
			}

		}, function (error) {
			throw error;
			done();
		});
	});
});