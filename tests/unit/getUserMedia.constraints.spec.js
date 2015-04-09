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

// Drawing into a canvas using video
var drawCanvas = function (v, callback) {
	var draw = function (v,c,w,h) {
    if(v.paused || v.ended) {
    	return false;
    }
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

// Parse the constraints of getUserMedia
var printJSON = function (obj, spaces) {
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
				outputStr += printJSON(val, spaces + 2);

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

	var tc13Constraints = {
		video: {
			optional: [{
				minWidth: 1024,
				maxWidth: 800
			}]
		}
	};

	var tc14Constraints = {
		video: {
			mandatory: {
				width: {
					min: 358
				},
				height: {
					min: 59
				}
			}
		}
	};

	var tc15Constraints = {
		video: {
			mandatory: {
				width: {
					max: 1310
				},
				height: {
					max: 120
				}
			}
		}
	};

	/* Get User Media */
	before(function (done) {
		this.timeout(testItemTimeout);

		if (window.webrtcDetectedBrowser !== 'IE' && window.webrtcDetectedBrowser !== 'Safari') {
			AdapterJS.onwebrtcreadyDone = true;
		}

		var checkReady = function () {
			if (document.readyState !== 'complete') {
				document.onload = function () {
					done();
				};
			} else {
				done();
			}
		};

		if (!AdapterJS.onwebrtcreadyDone) {
			AdapterJS.onwebrtcready = checkReady;

		} else {
			checkReady();
		}
	});

	it('getUserMedia(MediaStreamConstraints = ' + printJSON(tc1Constraints) + ')', function (done) {
		this.timeout(testItemTimeout + gUMTimeout);

		window.getUserMedia(tc1Constraints, function (stream) {
			expect(stream.getAudioTracks().length).to.equal(1);
			expect(stream.getVideoTracks().length).to.equal(0);
			done();

		}, function (error) {
			throw error;
		});
	});

	it('getUserMedia(MediaStreamConstraints = ' + printJSON(tc2Constraints) + ')', function (done) {
		this.timeout(testItemTimeout + gUMTimeout);

		window.getUserMedia(tc2Constraints, function (stream) {
			expect(stream.getAudioTracks().length).to.equal(1);
			expect(stream.getVideoTracks().length).to.equal(0);
			done();

		}, function (error) {
			throw error;
		});
	});

	it('getUserMedia(MediaStreamConstraints = ' + printJSON(tc3Constraints) + ')', function (done) {
		this.timeout(testItemTimeout + gUMTimeout);

		window.getUserMedia(tc3Constraints, function (stream) {
			expect(stream.getAudioTracks().length).to.equal(0);
			expect(stream.getVideoTracks().length).to.equal(1);
			done();

		}, function (error) {
			throw error;
		});
	});

	it('getUserMedia(MediaStreamConstraints = ' + printJSON(tc4Constraints) + ')', function (done) {
		this.timeout(testItemTimeout + gUMTimeout);

		window.getUserMedia(tc4Constraints, function (stream) {
			expect(stream.getAudioTracks().length).to.equal(0);
			expect(stream.getVideoTracks().length).to.equal(1);
			done();

		}, function (error) {
			throw error;
		});
	});

	it('getUserMedia(MediaStreamConstraints = ' + printJSON(tc5Constraints) + ')', function (done) {
		this.timeout(testItemTimeout + gUMTimeout);

		window.getUserMedia(tc4Constraints, function (stream) {
			expect(stream.getAudioTracks().length).to.equal(0);
			expect(stream.getVideoTracks().length).to.equal(1);
			done();

		}, function (error) {
			throw error;
		});
	});

	it('getUserMedia(MediaStreamConstraints = ' + printJSON(tc6Constraints) + ')', function (done) {
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

	it('getUserMedia(MediaStreamConstraints = ' + printJSON(tc7Constraints) + ')', function (done) {
		this.timeout(testItemTimeout + gUMTimeout + 5000);

		var video = document.createElement('video');
		video.autoplay = 'autoplay';

		video.onplay = function () {
			expect(video.offsetWidth).to.be.at.least(357);
			expect(video.offsetHeight).to.be.at.least(55);
			done();
		};

		document.body.appendChild(video);

		window.getUserMedia(tc7Constraints, function (stream) {

			attachMediaStream(video, stream);

		}, function (error) {
			throw error;
		});
	});

	it('getUserMedia(MediaStreamConstraints = ' + printJSON(tc8Constraints) + ')', function (done) {
		this.timeout(testItemTimeout + gUMTimeout + 5000);

		var video = document.createElement('video');
		video.autoplay = 'autoplay';

		video.onplay = function () {
			expect(video.offsetWidth).to.be.at.most(1357);
			expect(video.offsetHeight).to.be.at.most(135);
			done();
		};

		document.body.appendChild(video);

		window.getUserMedia(tc8Constraints, function (stream) {

			attachMediaStream(video, stream);

		}, function (error) {
			throw error;
		});
	});

	it('getUserMedia(MediaStreamConstraints = ' + printJSON(tc9Constraints) + ')', function (done) {
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

		window.getUserMedia(tc9Constraints, function (stream) {

			attachMediaStream(video, stream);

		}, function (error) {
			throw error;
		});
	});

	it('getUserMedia(MediaStreamConstraints = ' + printJSON(tc10Constraints) + ')', function (done) {
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

		window.getUserMedia(tc10Constraints, function (stream) {

			attachMediaStream(video, stream);

		}, function (error) {
			throw error;
		});
	});

	it('getUserMedia(MediaStreamConstraints = ' + printJSON(tc11Constraints) + ')', function (done) {
		this.timeout(testItemTimeout + gUMTimeout + 5000);

		var video = document.createElement('video');
		video.autoplay = 'autoplay';

		video.onplay = function () {
			expect(video.offsetWidth / video.offsetHeight).to.be.at.least(16 / 10);
			done();
		};

		document.body.appendChild(video);

		window.getUserMedia(tc11Constraints, function (stream) {

			attachMediaStream(video, stream);

		}, function (error) {
			throw error;
		});
	});

	it('getUserMedia(MediaStreamConstraints = ' + printJSON(tc12Constraints) + ')', function (done) {
		this.timeout(testItemTimeout + gUMTimeout + 5000);

		var video = document.createElement('video');
		video.autoplay = 'autoplay';

		video.onplay = function () {
			expect(video.offsetWidth / video.offsetHeight).to.be.at.most(21 / 9);
			done();
		};

		document.body.appendChild(video);

		window.getUserMedia(tc12Constraints, function (stream) {

			attachMediaStream(video, stream);

		}, function (error) {
			throw error;
		});
	});

	it('getUserMedia(MediaStreamConstraints = ' + printJSON(tc13Constraints) + ')', function (done) {
		this.timeout(testItemTimeout + gUMTimeout + 5000);

		document.body.appendChild(video);

		window.getUserMedia(tc13Constraints, function (stream) {

			assert.typeOf(stream, 'object');

			done();

		}, function (error) {
			throw new Error('Optional constraint should not affect the retrieval of getUserMedia');
		});
	});

	it('getUserMedia(MediaStreamConstraints = ' + printJSON(tc14Constraints) + ')', function (done) {
		this.timeout(testItemTimeout + gUMTimeout + 5000);

		var video = document.createElement('video');
		video.autoplay = 'autoplay';

		video.onplay = function () {
			expect(video.offsetWidth).to.be.at.least(358);
			expect(video.offsetHeight).to.be.at.least(59);
			done();
		};

		document.body.appendChild(video);

		window.getUserMedia(tc14Constraints, function (stream) {

			attachMediaStream(video, stream);

		}, function (error) {
			throw error;
		});
	});

	it('getUserMedia(MediaStreamConstraints = ' + printJSON(tc15Constraints) + ')', function (done) {
		this.timeout(testItemTimeout + gUMTimeout + 5000);

		var video = document.createElement('video');
		video.autoplay = 'autoplay';

		video.onplay = function () {
			expect(video.offsetWidth).to.be.at.most(1310);
			expect(video.offsetHeight).to.be.at.most(120);
			done();
		};

		document.body.appendChild(video);

		window.getUserMedia(tc15Constraints, function (stream) {

			attachMediaStream(video, stream);

		}, function (error) {
			throw error;
		});
	});


});