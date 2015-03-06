//mocha.bail();
//mocha.start();

var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;

var slowTimeout = window.webrtcDetectedBrowser === 'safari' || window.webrtcDetectedBrowser === 'IE' ? 5000 : 1;

describe('getUserMedia: Constraints', function() {
	this.slow(slowTimeout);

	it('Constraints = { audio: true, video: false }', function (done) {
		this.slow(100);

		var checkFn = function (stream) {
			stream.getAudioTracks().length.should.equal(1);
			stream.getVideoTracks().length.should.equal(0);

			done();
		};

		window.getUserMedia({ audio: true, video: false }, checkFn, checkFn);
	});

	it('Constraints = { audio: true }', function (done) {
		this.slow(100);

		var checkFn = function (stream) {
			stream.getAudioTracks().length.should.equal(1);
			stream.getVideoTracks().length.should.equal(0);

			done();
		};

		window.getUserMedia({ audio: true, video: false }, checkFn, checkFn);
	});

	it('Constraints = { audio: false, video: true }', function (done) {
		this.slow(100);

		var checkFn = function (stream) {
			stream.getAudioTracks().length.should.equal(0);
			stream.getVideoTracks().length.should.equal(1);

			done();
		};

		window.getUserMedia({ audio: true, video: false }, checkFn, checkFn);
	});

	it('Constraints = { video: true }', function (done) {
		this.slow(100);

		var checkFn = function (stream) {
			stream.getAudioTracks().length.should.equal(0);
			stream.getVideoTracks().length.should.equal(1);

			done();
		};

		window.getUserMedia({ audio: true, video: false }, checkFn, checkFn);
	});

	it('Constraints = { audio: true, video: true }', function (done) {
		this.slow(100);

		var checkFn = function (stream) {
			console.log('test:', stream.getAudioTracks().length, stream.getVideoTracks().length);
			stream.getAudioTracks().length.should.equal(1);
			stream.getVideoTracks().length.should.equal(1);

			done();
		};

		window.getUserMedia({ audio: true, video: false }, checkFn, checkFn);
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

	it('Constraints = { video: { mandatory: { maxWidth: 357, maxHeight: 55 } } }', function (done) {
		this.slow(100);

		var checkFn = function (stream) {
			attachMediaStream(video, stream);

			setTimeout(function () {
				video.offsetWidth.should.equal(357);
				video.offsetHeight.should.equal(55);

				done();
			}, 5000);
		};

		var video = document.createElement('video');
		video.autoplay = 'autoplay';

		document.body.appendChild(video);

		window.getUserMedia({
			video: {
				mandatory: {
	        maxWidth: 1357,
	        maxHeight: 55
	      }
			}
		}, checkFn, checkFn)
	});

	it('Constraints = { video: { mandatory: { minWidth: 357, minHeight: 55 } } }', function (done) {
		this.slow(100);

		var checkFn = function (stream) {
			attachMediaStream(video, stream);

			setTimeout(function () {
				video.offsetWidth.should.least(357);
				video.offsetHeight.should.least(55);

				done();
			}, 5000);
		};

		var video = document.createElement('video');
		video.autoplay = 'autoplay';

		document.body.appendChild(video);

		window.getUserMedia({
			video: {
				mandatory: {
	        maxWidth: 357,
	        maxHeight: 55
	      }
			}
		}, checkFn, checkFn);
	});

});