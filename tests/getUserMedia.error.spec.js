//mocha.bail();
//mocha.run();

var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;

var slowTimeout = window.webrtcDetectedBrowser === 'safari' || window.webrtcDetectedBrowser === 'IE' ? 5000 : 1;


describe('getUserMedia: Errors', function() {
	this.slow(slowTimeout);

	it('Error: MANDATORY_UNSATISFIED_ERROR', function (done) {
		this.timeout(8000);

		var checkerFn = setTimeout(function () {
			assert.fail(null, new Error('NavigatorUserMediaError'), 'Error does not trigger');
			done();
		}, 5000);

		window.getUserMedia({}, function (stream) {
			assert.fail(stream, new Error('NavigatorUserMediaError'), 'Error does not trigger');
			clearTimeout(checkerFn);
		}, function (error) {
			error.name.should.be = 'MANDATORY_UNSATISFIED_ERROR';
			clearTimeout(checkerFn);
			done();
		});
	});

	it.skip('Error: PERMISSION_DENIED | No available testing environment to automated this test', function () {});

	it.skip('Error: NOT_SUPPORTED_ERROR | No available testing environment to test this', function () {});
});