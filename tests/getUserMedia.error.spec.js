//mocha.bail();
//mocha.start();

var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;

var slowTimeout = window.webrtcDetectedBrowser === 'safari' || window.webrtcDetectedBrowser === 'IE' ? 5000 : 1;

describe('getUserMedia: Error', function() {

	it('Throws error when invalid constraints are passed', function () {
		this.slow(slowTimeout);

		expect(function () {
			window.getUserMedia({
				audio: true,
				video: true,
				fake: true
			});
		}).to.throw(Error);
	});

	it('Expects error when when no audio or video track is selected', function () {
		this.slow(slowTimeout);

		expect(function () {
			window.getUserMedia({
				audio: false,
				video: false
			});
		}).to.throw(Error);
	});
});