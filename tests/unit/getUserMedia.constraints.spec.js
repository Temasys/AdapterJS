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

// Shared functions
// Drawing into a canvas using video
var drawCanvas = function (v, callback) {
	var draw = function (v,c,w,h) {
    if(v.paused || v.ended) return false;
    c.drawImage(v,0,0,w,h);
    setTimeout(draw,20,v,c,w,h);
	};

  var canvas = document.getElementById('test');

  if (!canvas) {
  	canvas = document.createElement('canvas');
  	canvas.id = 'test';
  	document.body.appendChild(canvas);
  }

  var context = canvas.getContext('2d');

  var cw = Math.floor(canvas.clientWidth);
  var ch = Math.floor(canvas.clientHeight);
  canvas.width = cw;
  canvas.height = ch;

  draw(v,context,cw,ch);

 setTimeout(function () {
   v.pause();

   callback( checkCanvas(context, cw, ch) );
 }, 50);
};

// Checking the bytes of the canvas
var checkCanvas = function (ctx, width, height) {
	var nimg = ctx.getImageData(0, 0, width, height);

  var d = nimg.data;

  var i;

  for (i = 0; i < d.length; i += 4) {
    var r = d[i];
    var g = d[i + 1];
    var b = d[i + 2];

    if (r !== 0 || g !== 0 || b !== 0) {
    	return true;
    }
  }

  return false;
};

// Parse the constraints of getUserMedia
var parseConstraints = function (obj, spaces) {
	spaces = typeof spaces !== 'number' ? 2 : spaces;

	// make indentation
	var makeIndentation = function (spaces) {
		var str = '';
		var i;

		for (i = 0; i < spaces; i += 1) {
			str += ' ';
		}

		return str;
	};

	var opening = '{';
	var closing = '}';

	if (obj instanceof Array) {
		opening = '[';
		closing = ']';
	}

	// parse object
	var outputStr = makeIndentation(spaces - 2) + opening;
	var key;

	for (key in obj) {
		if (obj.hasOwnProperty(key)) {
			outputStr += '\n\t' + makeIndentation(spaces) + '"' + key + '": ';

			var val = obj[key];

			if (typeof val === 'object') {
				outputStr += parseConstraints(val, spaces + 2);

			} else if (typeof val === 'string') {
				outputStr += '"' + val + '"';

			} else {
				outputStr += val;
			}

			outputStr += ',';
		}
	}

	outputStr += '\n\t' + makeIndentation(spaces - 2) + closing;

	return outputStr;
};

describe('getUserMedia | MediaStreamConstraints', function() {
	this.timeout(testTimeout);

	/* Attributes */
	var stream = null;
	var track = null;

	var tc1Constraints = {
		audio: true,
		video: false
	};

	var tc2Constraints = {
		audio: true
	};

	var tc3Constraints = {
		audio: false,
		video: true
	};

	var tc4Constraints = {
		video: true
	};

	var tc5Constraints = {
		audio: true,
		video: true
	};

	var tc6Constraints = {
		audio: false,
		video: false
	};

	var tc7Constraints = {
		video: {
			mandatory: {
				minWidth: 357,
				minHeight: 55
			}
		}
	};

	var tc8Constraints = {
		video: {
			mandatory: {
				maxWidth: 1357,
				maxHeight: 135
			}
		}
	};

	var tc9Constraints = {
		video: {
			mandatory: {
				minFrameRate: 15
			}
		}
	};

	var tc10Constraints = {
		video: {
			mandatory: {
        maxFrameRate: 50
      }
		}
	};

	var tc11Constraints = {
		video: {
			mandatory: {
				minAspectRatio: '16:10'
			}
		}
	};

	var tc12Constraints = {
		video: {
			mandatory: {
				maxAspectRatio: '21:9'
			}
		}
	};

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

	it('getUserMedia(MediaStreamConstraints = ' + parseConstraints(tc1Constraints) + ')', function (done) {
		this.timeout(testItemTimeout + gUMTimeout);

		window.getUserMedia(tc1Constraints, function (stream) {
			expect(stream.getAudioTracks().length).to.equal(1);
			expect(stream.getVideoTracks().length).to.equal(0);
			done();

		}, function (error) {
			throw error;
		});
	});

	it('getUserMedia(MediaStreamConstraints = ' + parseConstraints(tc2Constraints) + ')', function (done) {
		this.timeout(testItemTimeout + gUMTimeout);

		window.getUserMedia(tc2Constraints, function (stream) {
			expect(stream.getAudioTracks().length).to.equal(1);
			expect(stream.getVideoTracks().length).to.equal(0);
			done();

		}, function (error) {
			throw error;
		});
	});

	it('getUserMedia(MediaStreamConstraints = ' + parseConstraints(tc3Constraints) + ')', function (done) {
		this.timeout(testItemTimeout + gUMTimeout);

		window.getUserMedia(tc3Constraints, function (stream) {
			expect(stream.getAudioTracks().length).to.equal(0);
			expect(stream.getVideoTracks().length).to.equal(1);
			done();

		}, function (error) {
			throw error;
		});
	});

	it('getUserMedia(MediaStreamConstraints = ' + parseConstraints(tc4Constraints) + ')', function (done) {
		this.timeout(testItemTimeout + gUMTimeout);

		window.getUserMedia(tc4Constraints, function (stream) {
			expect(stream.getAudioTracks().length).to.equal(0);
			expect(stream.getVideoTracks().length).to.equal(1);
			done();

		}, function (error) {
			throw error;
		});
	});

	it('getUserMedia(MediaStreamConstraints = ' + parseConstraints(tc5Constraints) + ')', function (done) {
		this.timeout(testItemTimeout + gUMTimeout);

		window.getUserMedia(tc4Constraints, function (stream) {
			expect(stream.getAudioTracks().length).to.equal(0);
			expect(stream.getVideoTracks().length).to.equal(1);
			done();

		}, function (error) {
			throw error;
		});
	});

	it('getUserMedia(MediaStreamConstraints = ' + parseConstraints(tc6Constraints) + ')', function (done) {
		this.timeout(testItemTimeout + gUMTimeout);

		var isInvoked = false;

		try {
			window.getUserMedia(tc6Constraints, function (stream) {
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

	it('getUserMedia(MediaStreamConstraints = ' + parseConstraints(tc7Constraints) + ')', function (done) {
		this.timeout(testItemTimeout + gUMTimeout + 5000);

		var isInvoked = false;

		var video = document.createElement('video');
		video.autoplay = 'autoplay';

		document.body.appendChild(video);

		window.getUserMedia(tc7Constraints, function () {
			isInvoked = true;

			attachMediaStream(video, stream);

			setTimeout(function () {
				expect(video.offsetWidth).to.be.at.least(357);
				expect(video.offsetHeight).to.be.at.least(55);
				done();
			}, 5000);

		}, function (error) {
			throw error;
		});

		setTimeout(function () {
			if (!isInvoked) {
				throw new Error('Does get MediaStream at all');
			}
		}, 2000);
	});

	it('getUserMedia(MediaStreamConstraints = ' + parseConstraints(tc8Constraints) + ')', function (done) {
		this.timeout(testItemTimeout + gUMTimeout + 5000);

		var isInvoked = false;

		var video = document.createElement('video');
		video.autoplay = 'autoplay';

		document.body.appendChild(video);

		window.getUserMedia(tc8Constraints, function () {
			isInvoked = true;

			attachMediaStream(video, stream);

			setTimeout(function () {
				expect(video.offsetWidth).to.be.at.most(1357);
				expect(video.offsetHeight).to.be.at.most(135);
				done();
			}, 5000);

		}, function (error) {
			throw error;
		});

		setTimeout(function () {
			if (!isInvoked) {
				throw new Error('Does get MediaStream at all');
			}
		}, 2000);
	});

	it('getUserMedia(MediaStreamConstraints = ' + parseConstraints(tc9Constraints) + ')', function (done) {
		this.timeout(testItemTimeout + gUMTimeout + 5000);

		var isInvoked = false;

		var video = document.createElement('video');
		video.autoplay = 'autoplay';

		document.body.appendChild(video);

		window.getUserMedia(tc9Constraints, function () {
			isInvoked = true;

			attachMediaStream(video, stream);

			setTimeout(function () {
				drawCanvas(video, function (isEmpty) {
					expect(isEmpty).to.equal(false);
					done();
				});
			}, 5000);

		}, function (error) {
			throw error;
		});

		setTimeout(function () {
			if (!isInvoked) {
				throw new Error('Does get MediaStream at all');
			}
		}, 2000);
	});

	it('getUserMedia(MediaStreamConstraints = ' + parseConstraints(tc10Constraints) + ')', function (done) {
		this.timeout(testItemTimeout + gUMTimeout + 5000);

		var isInvoked = false;

		var video = document.createElement('video');
		video.autoplay = 'autoplay';

		document.body.appendChild(video);

		window.getUserMedia(tc10Constraints, function () {
			isInvoked = true;

			attachMediaStream(video, stream);

			setTimeout(function () {
				drawCanvas(video, function (isEmpty) {
					expect(isEmpty).to.equal(false);
					done();
				});
			}, 5000);

		}, function (error) {
			throw error;
		});

		setTimeout(function () {
			if (!isInvoked) {
				throw new Error('Does get MediaStream at all');
			}
		}, 2000);
	});

	it('getUserMedia(MediaStreamConstraints = ' + parseConstraints(tc11Constraints) + ')', function (done) {
		this.timeout(testItemTimeout + gUMTimeout + 5000);

		var isInvoked = false;

		var video = document.createElement('video');
		video.autoplay = 'autoplay';

		document.body.appendChild(video);

		window.getUserMedia(tc11Constraints, function () {
			isInvoked = true;

			attachMediaStream(video, stream);
			expect(video.offsetWidth / video.offsetHeight).to.be.at.least(16 / 10);
			clearInterval(checkerFn);
			done();

		}, function (error) {
			throw error;
		});

		setTimeout(function () {
			if (!isInvoked) {
				throw new Error('Does get MediaStream at all');
			}
		}, 2000);
	});

	it('getUserMedia(MediaStreamConstraints = ' + parseConstraints(tc12Constraints) + ')', function (done) {
		this.timeout(testItemTimeout + gUMTimeout + 5000);

		var isInvoked = false;

		var video = document.createElement('video');
		video.autoplay = 'autoplay';

		document.body.appendChild(video);

		window.getUserMedia(tc12Constraints, function () {
			isInvoked = true;

			attachMediaStream(video, stream);
			expect(video.offsetWidth / video.offsetHeight).to.be.at.most(21 / 9);
			clearInterval(checkerFn);
			done();

		}, function (error) {
			throw error;
		});

		setTimeout(function () {
			if (!isInvoked) {
				throw new Error('Does get MediaStream at all');
			}
		}, 2000);
	});
});