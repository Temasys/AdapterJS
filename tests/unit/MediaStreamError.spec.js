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


describe('MediaStreamError', function() {
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

	it('MediaStreamError.name === "NotSupportedError"', function (done) {
		this.timeout(testItemTimeout);

		window.getUserMedia({}, function (stream) {
			throw new Error('Invalid constraints passed still triggers a success callback');

		}, function (error) {
			expect(error.name).to.equal('NotSupportedError');
		});
	});

	it.skip('MediaStreamError.name === "PermissionDeniedError"', function () {});

	it.skip('MediaStreamError.name === "ConstraintNotSatisfiedError"', function () {});

	it.skip('MediaStreamError.name === "OverconstrainedError"', function () {});

	it.skip('MediaStreamError.name === "NotFoundError"', function () {});

	it.skip('MediaStreamError.name === "AbortError"', function () {});

	it.skip('MediaStreamError.name === "SourceUnavailableError"', function () {});

});