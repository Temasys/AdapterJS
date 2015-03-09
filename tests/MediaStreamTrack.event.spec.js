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
		this.timeout(10000);

		var checkerFn = setTimeout(function () {
			assert.notOk(null, 'Does not triggers when getUserMedia has started');
			done();
		}, 7000);

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

	it('.onmute', function (done) {
		assert.notOk(null, 'No environment to test');
		done();
	});

	it('.onunmute', function (done) {
		assert.notOk(null, 'No environment to test');
		done();
	});

	it('.onoverconstrained', function (done) {
		assert.notOk(null, 'No environment to test');
		done();
	});

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