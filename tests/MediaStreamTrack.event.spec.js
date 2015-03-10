//mocha.bail();
//mocha.run();

var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;

var slowTimeout = window.webrtcDetectedBrowser === 'safari' || window.webrtcDetectedBrowser === 'IE' ? 5000 : 1;


describe('MediaStreamTrack: Events', function() {
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

	it('.onstarted', function (done) {
		this.timeout(7000);

		window.getUserMedia({
			audio: true,
			video: true
		}, function (data) {
			stream = data;
			track = stream.getAudioTracks()[0];
			track.onstarted = function (event) {
				assert.ok(event, 'Triggers when getUserMedia has started');
				clearTimeout(checkerFn);
				done();
			};
		}, function (error) {
			throw error;
			done();
		});
	});

	it.skip('.onmute | No available testing environment to test this', function () {});

	it.skip('.onunmute | No available testing environment to test this', function () {});

	it.skip('.onoverconstrained | No available testing environment to test this', function () {});

	it('.onended', function (done) {
		track.onended = function (event) {
			assert.ok(event, 'Triggers when stop() is invoked');
			done();
		};

		catchFn(function () {
			track.stop();
		}, done);
	});
});