//mocha.bail();
//mocha.start();

var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;

var slowTimeout = window.webrtcDetectedBrowser === 'safari' || window.webrtcDetectedBrowser === 'IE' ? 5000 : 1;

describe('getUserMedia: Constraints', function() {

	it('Test audio = true', function () {
		this.slow(slowTimeout);

	});
});