//mocha.bail();
//mocha.run();

var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;

// Get User Media timeout
var gUMTimeout = 2000;

// Test item timeout
var testItemTimeout = 2000;

// Init timeout
var initTimeout = 10000;

describe('getUserMedia | MediaStreamConstraints', function() {

	/* Attributes */
	var stream = null;
	var track = null;

	/* Get User Media */
	before(function (done) {
		this.timeout(initTimeout);

    AdapterJS.webRTCReady(function() {
    	done();
    });
	});


	(function (constraints) {
		it('getUserMedia(MediaStreamConstraints = ' + JSON.stringify(constraints) + ')', function (done) {
			this.timeout(testItemTimeout + gUMTimeout);

			window.getUserMedia(constraints, function (stream) {
				expect(stream.getAudioTracks().length).to.equal(1);
				expect(stream.getVideoTracks().length).to.equal(0);
				done();

			}, function (error) {
				throw error;
			});
		});

	})({ audio: true,	video: false });


	(function (constraints) {
		it('getUserMedia(MediaStreamConstraints = ' + JSON.stringify(constraints) + ')', function (done) {
			this.timeout(testItemTimeout + gUMTimeout);

			window.getUserMedia(constraints, function (stream) {
				expect(stream.getAudioTracks().length).to.equal(1);
				expect(stream.getVideoTracks().length).to.equal(0);
				done();

			}, function (error) {
				throw error;
			});
		});

	})({ audio: true });


	(function (constraints) {
		it('getUserMedia(MediaStreamConstraints = ' + JSON.stringify(constraints) + ')', function (done) {
			this.timeout(testItemTimeout + gUMTimeout);

			window.getUserMedia(constraints, function (stream) {
				expect(stream.getAudioTracks().length).to.equal(0);
				expect(stream.getVideoTracks().length).to.equal(1);
				done();

			}, function (error) {
				throw error;
			});
		});
	})({ audio: false, video: true });


	(function (constraints) {
		it('getUserMedia(MediaStreamConstraints = ' + JSON.stringify(constraints) + ')', function (done) {
			this.timeout(testItemTimeout + gUMTimeout);

			window.getUserMedia(constraints, function (stream) {
				expect(stream.getAudioTracks().length).to.equal(0);
				expect(stream.getVideoTracks().length).to.equal(1);
				done();

			}, function (error) {
				throw error;
			});
		});
	})({ video: true });


	(function (constraints) {
		it('getUserMedia(MediaStreamConstraints = ' + JSON.stringify(constraints) + ')', function (done) {
			this.timeout(testItemTimeout + gUMTimeout);

			window.getUserMedia(constraints, function (stream) {
				expect(stream.getAudioTracks().length).to.equal(1);
				expect(stream.getVideoTracks().length).to.equal(1);
				done();

			}, function (error) {
				throw error;
			});
		});
	})({ audio: true, video: true });


	(function (constraints) {
		it('getUserMedia(MediaStreamConstraints = ' + JSON.stringify(constraints) + ')', function (done) {
			this.timeout(testItemTimeout + gUMTimeout);

			window.getUserMedia(constraints, function (stream) {
				expect(stream.getAudioTracks().length).to.equal(0);
				expect(stream.getVideoTracks().length).to.equal(0);
				done();

			}, function (error) {
				throw error;
			});
		});
	})({ audio: false, video: false });


	(function (constraints) {
		it('getUserMedia(MediaStreamConstraints = ' + JSON.stringify(constraints) + ')', function (done) {
			this.timeout(testItemTimeout + gUMTimeout);

			var video = document.createElement('video');    
			if (webrtcDetectedBrowser !== 'IE') {
				video.autoplay = 'autoplay';
			}

			video.onplaying = function () {
				expect(video.videoWidth).to.be.at.least(1240);
				expect(video.videoHeight).to.be.at.least(720);
				done();
			};

			document.body.appendChild(video);

			window.getUserMedia(constraints, function (stream) {
				video = attachMediaStream(video, stream);
			}, function (error) {
				throw error;
			});
		});
	})({ video: { mandatory: { minWidth: 1240, minHeight: 720 } } });


	(function (constraints) {
		it('getUserMedia(MediaStreamConstraints = ' + JSON.stringify(constraints) + ')', function (done) {
			this.timeout(testItemTimeout + gUMTimeout);

			var video = document.createElement('video');
			if (webrtcDetectedBrowser !== 'IE') {
				video.autoplay = 'autoplay';
			}

			video.onplaying = function () {
				expect(video.videoWidth).to.be.at.most(600);
				expect(video.videoHeight).to.be.at.most(300);
				done();
			};

			document.body.appendChild(video);

			window.getUserMedia(constraints, function (stream) {
				video = attachMediaStream(video, stream);
			}, function (error) {
				throw error;
			});
		});
	})({ video: { mandatory: { maxWidth: 600, maxHeight: 300 } } });


	(function (constraints) {
		it.skip('getUserMedia(MediaStreamConstraints = ' + JSON.stringify(constraints) + ')', function (done) {
			this.timeout(testItemTimeout + gUMTimeout);

			window.getUserMedia(constraints, function (stream) {
				//TODO(J-O): check framerate
				// Follow these bugs:
				// https://code.google.com/p/webrtc/issues/detail?id=4807
				// https://code.google.com/p/webrtc/issues/detail?id=2481

				// var settings = stream.getVideoTracks()[0].getSettings();
				// expect(setting.).to.be.at.most(600);
			}, function (error) {
				throw error;
			});
		});
	})({ video: { mandatory: { minFrameRate: 15 } } });


	(function (constraints) {
		it.skip('getUserMedia(MediaStreamConstraints = ' + JSON.stringify(constraints) + ')', function (done) {
			this.timeout(testItemTimeout + gUMTimeout);

			window.getUserMedia(constraints, function (stream) {
				//TODO(J-O): check framerate
				// Follow these bugs:
				// https://code.google.com/p/webrtc/issues/detail?id=4807
				// https://code.google.com/p/webrtc/issues/detail?id=2481

				// var settings = stream.getVideoTracks()[0].getSettings();
				// expect(setting.).to.be.at.most(600);
			}, function (error) {
				throw error;
			});
		});
	})({ video: { mandatory: { maxFrameRate: 50 } } });


	(function (constraints) {
		it('getUserMedia(MediaStreamConstraints = ' + JSON.stringify(constraints) + ')', function (done) {
			this.timeout(testItemTimeout + gUMTimeout);

			var video = document.createElement('video');
			if (webrtcDetectedBrowser !== 'IE') {
				video.autoplay = 'autoplay';
			}

			video.onplaying = function () {
				expect(video.videoWidth / video.videoHeight).to.be.at.least(16 / 10);
				done();
			};

			document.body.appendChild(video);

			window.getUserMedia(constraints, function (stream) {
				video = attachMediaStream(video, stream);
			}, function (error) {
				throw error;
			});
		});
	})({ video: { mandatory: { minAspectRatio: '16:10' } } });


	(function (constraints) {
		it('getUserMedia(MediaStreamConstraints = ' + JSON.stringify(constraints) + ')', function (done) {
			this.timeout(testItemTimeout + gUMTimeout);

			var video = document.createElement('video');
			if (webrtcDetectedBrowser !== 'IE') {
				video.autoplay = 'autoplay';
			}

			video.onplaying = function () {
				expect(video.videoWidth / video.videoHeight).to.be.at.most(21 / 9);
				done();
			};

			document.body.appendChild(video);

			window.getUserMedia(constraints, function (stream) {
				video = attachMediaStream(video, stream);
			}, function (error) {
				throw error;
			});
		});
	})({ video: { mandatory: { maxAspectRatio: '21:9' } } });


	(function (constraints) {
		it('getUserMedia(MediaStreamConstraints = ' + JSON.stringify(constraints) + ')', function (done) {
			this.timeout(testItemTimeout + gUMTimeout);

			var video = document.createElement('video');
			document.body.appendChild(video);

			window.getUserMedia(constraints, function (stream) {
				assert.typeOf(stream, 'object');
				done();
			}, function (error) {
				throw new Error('Optional constraint should not affect the retrieval of getUserMedia');
			});
		});
	})({ video: { optional: [{ minWidth: 1024, maxWidth: 800 }] } });


	(function (constraints) {
		it.skip('getUserMedia(MediaStreamConstraints = ' + JSON.stringify(constraints) + ')', function (done) {
			this.timeout(testItemTimeout + gUMTimeout);

			var video = document.createElement('video');
			if (webrtcDetectedBrowser !== 'IE') {
				video.autoplay = 'autoplay';
			}

			video.onplaying = function () {
				expect(video.videoWidth).to.be.at.least(358);
				expect(video.videoHeight).to.be.at.least(59);
				done();
			};

			document.body.appendChild(video);

			window.getUserMedia(constraints, function (stream) {
				video = attachMediaStream(video, stream);
			}, function (error) {
				throw error;
			});
		});
	})({ video: { mandatory: { width: { min: 358 }, height: { min: 59 } } } });


	(function (constraints) {
		it.skip('getUserMedia(MediaStreamConstraints = ' + JSON.stringify(constraints) + ')', function (done) {
			this.timeout(testItemTimeout + gUMTimeout);

			var video = document.createElement('video');
			if (webrtcDetectedBrowser !== 'IE') {
				video.autoplay = 'autoplay';
			}
			
			video.onplaying = function () {
				expect(video.videoWidth).to.be.at.most(1310);
				expect(video.videoHeight).to.be.at.most(120);
				done();
			};

			document.body.appendChild(video);

			window.getUserMedia(constraints, function (stream) {
				video = attachMediaStream(video, stream);
			}, function (error) {
				throw error;
			});
		});
	})({ video: { mandatory: { width: { max: 1310 }, height: { max: 120 } } } });

});