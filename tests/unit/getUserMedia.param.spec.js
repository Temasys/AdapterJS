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
var testItemTimeout = 4000;


describe('getUserMedia | Parameters', function() {
	this.timeout(testTimeout);

	/* Get User Media */
	before(function (done) {
		this.timeout(testItemTimeout);

		if (window.webrtcDetectedBrowser !== 'IE' && window.webrtcDetectedBrowser !== 'Safari') {
			AdapterJS.onwebrtcreadyDone = true;
		}

		if (!AdapterJS.onwebrtcreadyDone) {
			AdapterJS.onwebrtcready = function () {
				done();
			};

		} else {
			done();
		}
	});

	it('Expects 3 parameters when 2 is only provided', function () {
		this.timeout(testItemTimeout);

		expect(function () {
			window.getUserMedia({
				audio: true,
				video: true
			}, function () {});
		}).to.throw(TypeError);
	});

	it('Expects 3 parameters should pass', function (done) {
		this.timeout(testItemTimeout);

		window.getUserMedia({
			audio: true,
			video: true

		}, function (stream) {
			assert.typeOf(stream, 'object');
			done();

		}, function (error) {
			throw error;
		});
	});
});