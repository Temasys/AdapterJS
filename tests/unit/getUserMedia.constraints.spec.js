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


describe('getUserMedia | MediaStreamConstraints', function() {
	this.timeout(testTimeout);

	/* Attributes */
	var stream = null;
	var track = null;


	/* Get User Media */
	before(function (done) {
		this.timeout(testItemTimeout);

		if (window.webrtcDetectedBrowser !== 'IE' && window.webrtcDetectedBrowser !== 'Safari') {
			AdapterJS.onwebrtcreadyDone = true;
		}

		var init = function () {
			if (document.readyState !== 'complete') {
				document.onload = function () {
					done();
				};
			} else {
				done();
			}
		};

		if (!AdapterJS.onwebrtcreadyDone) {
			AdapterJS.onwebrtcready = init;

		} else {
			init();
		}
	});


	(function (constraints) {
		it('getUserMedia(MediaStreamConstraints = ' + printJSON(constraints) + ')', function (done) {
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
		it('getUserMedia(MediaStreamConstraints = ' + printJSON(constraints) + ')', function (done) {
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
		it('getUserMedia(MediaStreamConstraints = ' + printJSON(constraints) + ')', function (done) {
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
		it('getUserMedia(MediaStreamConstraints = ' + printJSON(constraints) + ')', function (done) {
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
		it('getUserMedia(MediaStreamConstraints = ' + printJSON(constraints) + ')', function (done) {
			this.timeout(testItemTimeout + gUMTimeout);

			window.getUserMedia(constraints, function (stream) {
				expect(stream.getAudioTracks().length).to.equal(0);
				expect(stream.getVideoTracks().length).to.equal(1);
				done();

			}, function (error) {
				throw error;
			});
		});
	})({ audio: true, video: true });


	(function (constraints) {
		it('getUserMedia(MediaStreamConstraints = ' + printJSON(constraints) + ')', function (done) {
			this.timeout(testItemTimeout + gUMTimeout);

			var isInvoked = false;

			try {
				window.getUserMedia(constraints, function (stream) {
					isInvoked = true;
					throw new Error('Stream is retrieved');

				}, function (error) {
					isInvoked = true;
					done();
				});
			} catch (error) {
				isInvoked = true;
				done();
			}

			setTimeout(function () {
				if (!isInvoked) {
					done();
				}
			}, 2000);
		});
	})({ audio: false, video: false });


	(function (constraints) {
		it('getUserMedia(MediaStreamConstraints = ' + printJSON(constraints) + ')', function (done) {
			this.timeout(testItemTimeout + gUMTimeout + 5000);

			var video = document.createElement('video');
			video.autoplay = 'autoplay';

			video.onplay = function () {
				expect(video.offsetWidth).to.be.at.least(357);
				expect(video.offsetHeight).to.be.at.least(55);
				done();
			};

			document.body.appendChild(video);

			window.getUserMedia(constraints, function (stream) {

				attachMediaStream(video, stream);

			}, function (error) {
				throw error;
			});
		});
	})({ video: { mandatory: { minWidth: 357, minHeight: 55 } } });


	(function (constraints) {
		it('getUserMedia(MediaStreamConstraints = ' + printJSON(constraints) + ')', function (done) {
			this.timeout(testItemTimeout + gUMTimeout + 5000);

			var video = document.createElement('video');
			video.autoplay = 'autoplay';

			video.onplay = function () {
				expect(video.offsetWidth).to.be.at.most(1357);
				expect(video.offsetHeight).to.be.at.most(135);
				done();
			};

			document.body.appendChild(video);

			window.getUserMedia(constraints, function (stream) {

				attachMediaStream(video, stream);

			}, function (error) {
				throw error;
			});
		});
	})({ video: { mandatory: { maxWidth: 1357, maxHeight: 135 } } });


	(function (constraints) {
		it('getUserMedia(MediaStreamConstraints = ' + printJSON(constraints) + ')', function (done) {
			this.timeout(testItemTimeout + gUMTimeout + 5000);

			var video = document.createElement('video');
			video.autoplay = 'autoplay';

			video.onplay = function () {
				drawCanvas(video, function (isEmpty) {
					expect(isEmpty).to.equal(false);
					done();
				});
			};

			document.body.appendChild(video);

			window.getUserMedia(constraints, function (stream) {

				attachMediaStream(video, stream);

			}, function (error) {
				throw error;
			});
		});
	})({ video: { mandatory: { minFrameRate: 15 } } });


	(function (constraints) {
		it('getUserMedia(MediaStreamConstraints = ' + printJSON(constraints) + ')', function (done) {
			this.timeout(testItemTimeout + gUMTimeout + 5000);

			var video = document.createElement('video');
			video.autoplay = 'autoplay';

			video.onplay = function () {
				drawCanvas(video, function (isEmpty) {
					expect(isEmpty).to.equal(false);
					done();
				});
			};

			document.body.appendChild(video);

			window.getUserMedia(constraints, function (stream) {

				attachMediaStream(video, stream);

			}, function (error) {
				throw error;
			});
		});
	})({ video: { mandatory: { maxFrameRate: 50 } } });


	(function (constraints) {
		it('getUserMedia(MediaStreamConstraints = ' + printJSON(constraints) + ')', function (done) {
			this.timeout(testItemTimeout + gUMTimeout + 5000);

			var video = document.createElement('video');
			video.autoplay = 'autoplay';

			video.onplay = function () {
				expect(video.offsetWidth / video.offsetHeight).to.be.at.least(16 / 10);
				done();
			};

			document.body.appendChild(video);

			window.getUserMedia(constraints, function (stream) {

				attachMediaStream(video, stream);

			}, function (error) {
				throw error;
			});
		});
	})({ video: { mandatory: { minAspectRatio: '16:10' } } });


	(function (constraints) {
		it('getUserMedia(MediaStreamConstraints = ' + printJSON(constraints) + ')', function (done) {
			this.timeout(testItemTimeout + gUMTimeout + 5000);

			var video = document.createElement('video');
			video.autoplay = 'autoplay';

			video.onplay = function () {
				expect(video.offsetWidth / video.offsetHeight).to.be.at.most(21 / 9);
				done();
			};

			document.body.appendChild(video);

			window.getUserMedia(constraints, function (stream) {

				attachMediaStream(video, stream);

			}, function (error) {
				throw error;
			});
		});
	})({ video: { mandatory: { maxAspectRatio: '21:9' } } });


	(function (constraints) {
		it('getUserMedia(MediaStreamConstraints = ' + printJSON(constraints) + ')', function (done) {
			this.timeout(testItemTimeout + gUMTimeout + 5000);

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
		it('getUserMedia(MediaStreamConstraints = ' + printJSON(constraints) + ')', function (done) {
			this.timeout(testItemTimeout + gUMTimeout + 5000);

			var video = document.createElement('video');
			video.autoplay = 'autoplay';

			video.onplay = function () {
				expect(video.offsetWidth).to.be.at.least(358);
				expect(video.offsetHeight).to.be.at.least(59);
				done();
			};

			document.body.appendChild(video);

			window.getUserMedia(constraints, function (stream) {

				attachMediaStream(video, stream);

			}, function (error) {
				throw error;
			});
		});
	})({ video: { mandatory: { width: { min: 358 }, height: { min: 59 } } } });


	(function (constraints) {
		it('getUserMedia(MediaStreamConstraints = ' + printJSON(constraints) + ')', function (done) {
			this.timeout(testItemTimeout + gUMTimeout + 5000);

			var video = document.createElement('video');
			video.autoplay = 'autoplay';

			video.onplay = function () {
				expect(video.offsetWidth).to.be.at.most(1310);
				expect(video.offsetHeight).to.be.at.most(120);
				done();
			};

			document.body.appendChild(video);

			window.getUserMedia(constraints, function (stream) {

				attachMediaStream(video, stream);

			}, function (error) {
				throw error;
			});
		});
	})({ video: { mandatory: { width: { max: 1310 }, height: { max: 120 } } } });

});