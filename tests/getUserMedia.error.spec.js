//mocha.bail();
//mocha.start();

var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;

var slowTimeout = window.webrtcDetectedBrowser === 'safari' || window.webrtcDetectedBrowser === 'IE' ? 5000 : 1;

describe('getUserMedia: Error', function() {
	this.slow(slowTimeout);

	it('Expects error when when no audio or video track is selected', function (done) {
		expect(function () {
			window.getUserMedia({
				audio: false,
				video: false
			}, function () {}, function () {});
		}).to.throw(Error);
	});
});