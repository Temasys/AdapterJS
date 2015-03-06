//mocha.bail();
//mocha.start();

var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;

var slowTimeout = window.webrtcDetectedBrowser === 'safari' || window.webrtcDetectedBrowser === 'IE' ? 5000 : 1;

describe('getUserMedia: Constraints', function() {
	//this.timeout(15000 + slowTimeout);
	this.slow(slowTimeout);

	var streamTest1 = null;
	var streamTest2 = null;
	var streamTest3 = null;
	var streamTest4 = null;
	var streamTest5 = null;
	var streamTest6 = null;
	var streamTest7 = null;

	before(function (done) {
		window.getUserMedia({
			audio: true,
			video: false
		}, function (stream) {
			streamTest1 = stream;
			done();
		}, function (error) {
			throw error;
		});
	});

	before(function (done) {
		window.getUserMedia({
			audio: true
		}, function (stream) {
			streamTest2 = stream;
			done();
		}, function (error) {
			throw error;
		});
	});

	before(function (done) {
		window.getUserMedia({
			audio: false,
			video: true
		}, function (stream) {
			streamTest3 = stream;
			done();
		}, function (error) {
			throw error;
		});
	});

	before(function (done) {
		window.getUserMedia({
			video: true
		}, function (stream) {
			streamTest4 = stream;
			done();
		}, function (error) {
			throw error;
		});
	});

	before(function (done) {
		window.getUserMedia({
			audio: true,
			video: true
		}, function (stream) {
			streamTest5 = stream;
			done();
		}, function (error) {
			throw error;
		});
	});

	before(function (done) {
		window.getUserMedia({
			video: {
				mandatory: {
	        maxWidth: 357,
	        maxHeight: 55
	      }
			}
		}, function (stream) {
			streamTest6 = stream;
			done();
		}, function (error) {
			throw error;
		});
	});

	before(function (done) {
		window.getUserMedia({
			video: {
				mandatory: {
	        minWidth: 357,
	        minHeight: 55
	      }
			}
		}, function (stream) {
			streamTest7 = stream;
			done();
		}, function (error) {
			throw error;
		});
	});

	it('Constraints = { audio: true, video: false }', function (done) {
		streamTest1.getAudioTracks().length.should.equal(1);
		streamTest1.getVideoTracks().length.should.equal(0);
	});

	it('Constraints = { audio: true }', function () {
		streamTest2.getAudioTracks().length.should.equal(1);
		streamTest2.getVideoTracks().length.should.equal(0);
	});

	it('Constraints = { audio: false, video: true }', function () {
		streamTest3.getAudioTracks().length.should.equal(0);
		streamTest3.getVideoTracks().length.should.equal(1);
	});

	it('Constraints = { video: true }', function () {
		streamTest4.getAudioTracks().length.should.equal(0);
		streamTest4.getVideoTracks().length.should.equal(1);
	});

	it('Constraints = { audio: true, video: true }', function () {
		streamTest5.getAudioTracks().length.should.equal(1);
		streamTest5.getVideoTracks().length.should.equal(1);
	});

	/*
	mandatory: {
        //minWidth: videoOptions.resolution.width,
        //minHeight: videoOptions.resolution.height,
        maxWidth: videoOptions.resolution.width,
        maxHeight: videoOptions.resolution.height,
        //minFrameRate: videoOptions.frameRate,
        maxFrameRate: videoOptions.frameRate
      }*/

	it('Constraints = { video: { mandatory: { maxWidth: 357, maxHeight: 55 } } }', function () {
		var video = document.createElement('video');
		video.autoplay = 'autoplay';

		document.body.appendChild(video);

		attachMediaStream(video, streamTest6);

		setTimeout(function () {
			video.offsetWidth.should.equal(357);
			video.offsetHeight.should.equal(55);
		}, 5000);
	});

	it('Constraints = { video: { mandatory: { minWidth: 357, minHeight: 55 } } }', function () {
		var video = document.createElement('video');
		video.autoplay = 'autoplay';

		document.body.appendChild(video);

		attachMediaStream(video, streamTest7);

		setTimeout(function () {
			video.offsetWidth.should.least(357);
			video.offsetHeight.should.least(55);
		}, 5000);
	});

});