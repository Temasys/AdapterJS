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
			assert.notOk(null, 'Error does not trigger');
		}, 5000);

		window.getUserMedia({}, function (stream) {
			assert.notOk(stream, 'Error does not trigger');
			clearTimeout(checkerFn);
		}, function (error) {
			error.name.should.be = 'MANDATORY_UNSATISFIED_ERROR';
			clearTimeout(checkerFn);
			done();
		});
	});

	it('Error: PERMISSION_DENIED', function (done) {
		assert.notOk(null, 'No available automated test for this');
	});

	it('Error: MANDATORY_UNSATISFIED_ERROR', function (done) {
		assert.notOk(null, 'No available testing environment for this');
	});
});