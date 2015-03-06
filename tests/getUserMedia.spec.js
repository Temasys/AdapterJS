//mocha.bail();
//mocha.run();

var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;

var slowTimeout = window.webrtcDetectedBrowser === 'safari' || window.webrtcDetectedBrowser === 'IE' ? 5000 : 1;


describe('getUserMedia: Parameters', function() {
	this.slow(slowTimeout);

	it('Is supported', function () {
		assert.typeOf(window.getUserMedia, 'function');
	});

	it('Expects 3 parameters when 1 is only provided', function () {
		expect(function () {
			window.getUserMedia({
				audio: true,
				video: true
			});
		}).to.throw(TypeError);
	});

	it('Expects 3 parameters when 2 is only provided', function () {
		expect(function () {
			window.getUserMedia({
				audio: true,
				video: true
			}, function () {});
		}).to.throw(TypeError);
	});

	it('Expects 3 parameters should pass', function (done) {
		var checkFn = function (media) {
			assert.typeOf(media, 'object');

			done();
		};

		window.getUserMedia({
			audio: true,
			video: true
		}, checkFn, checkFn);
	});
});