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


	/* WebRTC Object should be initialized in Safari/IE Plugin */
  before(function (done) {
    this.timeout(testItemTimeout);

	AdapterJS.webRTCReady(function() {
		done();
	});
  });

	it('MediaStreamError.name === "NotSupportedError" < When > MediaStreamConstraints === {}', function (done) {
		this.timeout(testItemTimeout);

		try {
			window.getUserMedia({}, function (stream) {
				throw new Error('Invalid constraints passed still triggers a success callback');

			}, function (error) {
				throw error;
			});
		} catch (error) {
			expect(error.name).to.equal('NotSupportedError');
		}
	});

	it('MediaStreamError.name === "NotSupportedError" < When > MediaStreamConstraints === { doesnotexist: true }', function (done) {
		this.timeout(testItemTimeout + gUMTimeout);

		var isInvoked = false;

		try {
			window.getUserMedia({
				doesnotexist: true

			}, function (stream) {
				isInvoked = true;
				throw new Error('Stream should not be retrieved');

			}, function (error) {
				isInvoked = true;
				throw error;
			});
		} catch (error) {
			expect(error.name).to.equal('NotSupportedError');
		}
	});

	it.skip('MediaStreamError.name === "PermissionDeniedError"', function () {});

	it('MediaStreamError.name === "ConstraintNotSatisfiedError"', function (done) {
		this.timeout(testItemTimeout);

		window.getUserMedia({
			video: {
				minWidth: Infinity
			}
		}, function (stream) {
			throw new Error('Invalid constraints passed still triggers a success callback');

		}, function (error) {
			expect(error.name).to.equal('ConstraintNotSatisfiedError');
	    	expect(error.constraintName).to.equal('minWidth');
	    	done();
		});
	});

	it.skip('MediaStreamError.name === "OverconstrainedError"', function () {});

	it.skip('MediaStreamError.name === "NotFoundError"', function () {});

	it.skip('MediaStreamError.name === "AbortError"', function () {});

	it.skip('MediaStreamError.name === "SourceUnavailableError"', function () {});

});