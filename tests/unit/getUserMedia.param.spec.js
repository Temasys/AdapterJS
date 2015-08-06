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

	    AdapterJS.webRTCReady(function() {
	    	done();
	    });
	});

	it('getUserMedia(constraints) -> Error', function () {
		this.timeout(testItemTimeout);

		expect(function () {
			window.getUserMedia({
				audio: true,
				video: true
			});
		}).to.throw(TypeError);
	});

	it('getUserMedia(constraints, successCallback) -> Error', function () {
		this.timeout(testItemTimeout);

		expect(function () {
			window.getUserMedia({
				audio: true,
				video: true
			}, function () {});
		}).to.throw(TypeError);
	});

	it('getUserMedia(constraints, successCallback :: emit -> MediaStream, failureCallback)', function (done) {
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