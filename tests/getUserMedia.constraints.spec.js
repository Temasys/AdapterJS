//mocha.bail();
//mocha.start();

var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;

var slowTimeout = window.webrtcDetectedBrowser === 'safari' || window.webrtcDetectedBrowser === 'IE' ? 5000 : 1;

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

  v.addEventListener('play', function(){
      draw(this,context,cw,ch);
  },false);

 setTimeout(function () {
   v.pause();

   callback( checkCanvas(context, cw, ch) );
 }, 50);
};

var checkCanvas = function (ctx, width, height) {
	var nimg = ctx.getImageData(0, 0, width, height);

  var d = nimg.data;

  for (var i=0; i<d.length; i+=4) {
    var r = d[i];
    var g = d[i + 1];
    var b = d[i + 2];

    console.info('data', r, g, b);

    if (r !== 0 || g !== 0 || b !== 0) {
    	return true;
    }
  }

  return false;
};

describe('getUserMedia: Constraints', function() {
	this.slow(slowTimeout);

	it('Constraints = { audio: true, video: false }', function (done) {
		var checkFn = function (stream) {
			stream.getAudioTracks().length.should.equal(1);
			stream.getVideoTracks().length.should.equal(0);
			done();
		};

		var errorFn = function (error) {
			throw error;
			done();
		};

		window.getUserMedia({ audio: true, video: false }, checkFn, errorFn);
	});

	it('Constraints = { audio: true }', function (done) {
		var checkFn = function (stream) {
			stream.getAudioTracks().length.should.equal(1);
			stream.getVideoTracks().length.should.equal(0);
			done();
		};

		var errorFn = function (error) {
			throw error;
			done();
		};

		window.getUserMedia({ audio: true }, checkFn, errorFn);
	});

	it('Constraints = { audio: false, video: true }', function (done) {
		var checkFn = function (stream) {
			stream.getAudioTracks().length.should.equal(0);
			stream.getVideoTracks().length.should.equal(1);
			done();
		};

		var errorFn = function (error) {
			throw error;
			done();
		};

		window.getUserMedia({ audio: false, video: true }, checkFn, errorFn);
	});

	it('Constraints = { video: true }', function (done) {
		var checkFn = function (stream) {
			stream.getAudioTracks().length.should.equal(0);
			stream.getVideoTracks().length.should.equal(1);
			done();
		};

		var errorFn = function (error) {
			throw error;
			done();
		};

		window.getUserMedia({ video: true }, checkFn, errorFn);
	});

	it('Constraints = { audio: true, video: true }', function (done) {
		var checkFn = function (stream) {
			stream.getAudioTracks().length.should.equal(1);
			stream.getVideoTracks().length.should.equal(1);
			done();
		};

		var errorFn = function (error) {
			throw error;
			done();
		};

		window.getUserMedia({ audio: true, video: true }, checkFn, errorFn);
	});

	it('Constraints = { audio: false, video: false }', function (done) {
		this.timeout(6000);

		var stream = null;

		var doneFn = function () {
			clearTimeout(checkFn);
			done();
		};

		var checkFn = setTimeout(function () {
			if (stream === null) {
				assert.ok('Does not get stream', 'Does not do anything');
				doneFn();
			}
		}, 5000);

		try {
			window.getUserMedia({ video: false, audio: false }, function (stream) {
				assert.notOk('Does not get stream', 'Gets an empty stream');
				doneFn();
			}, function (error) {
				assert.ok('Does not get stream', 'Throws an Error when invoking getUserMedia');
				doneFn();
			});

		} catch (error) {
			assert.ok('Does not get stream', 'Throws an Error when invoking getUserMedia');
			doneFn();
		}
	});

	it('Constraints = { video: { mandatory: { maxWidth: 357, maxHeight: 55 } } }', function (done) {
		this.timeout(6500);

		var video = document.createElement('video');
		video.autoplay = 'autoplay';

		document.body.appendChild(video);

		var checkFn = function (stream) {
			attachMediaStream(video, stream);

			setTimeout(function () {
				video.offsetWidth.should.most(357);
				video.offsetHeight.should.most(55);
				done();
			}, 5000);
		};

		var errorFn = function (error) {
			throw error;
			done();
		};

		window.getUserMedia({
			video: {
				mandatory: {
	        maxWidth: 357,
	        maxHeight: 55
	      }
			}
		}, checkFn, errorFn)
	});

	it('Constraints = { video: { mandatory: { minWidth: 357, minHeight: 55 } } }', function (done) {
		this.timeout(6500);

		var video = document.createElement('video');
		video.autoplay = 'autoplay';

		document.body.appendChild(video);

		var checkFn = function (stream) {
			attachMediaStream(video, stream);

			setTimeout(function () {
				video.offsetWidth.should.least(357);
				video.offsetHeight.should.least(55);
				done();
			}, 5000);
		};

		var errorFn = function (error) {
			throw error;
			done();
		};

		window.getUserMedia({
			video: {
				mandatory: {
	        minWidth: 357,
	        minHeight: 55
	      }
			}
		}, checkFn, errorFn);
	});

	it('Constraints = { video: { mandatory: { minFrameRate: 500 } } }', function (done) {
		this.timeout(15000);

		var video = document.createElement('video');
		video.autoplay = 'autoplay';

		document.body.appendChild(video);

		var checkFn = function (stream) {
			attachMediaStream(video, stream);

			drawCanvas(video, function (isEmpty) {
				isEmpty.should.equal(true);
				done();
			});
		};

		var errorFn = function (error) {
			throw error;
			done();
		};

		window.getUserMedia({
			video: {
				mandatory: {
	        minFrameRate: 500
	      }
			}
		}, checkFn, errorFn);
	});

	it('Constraints = { video: { mandatory: { maxFrameRate: 500 } } }', function (done) {
		this.timeout(15000);

		var video = document.createElement('video');
		video.autoplay = 'autoplay';

		document.body.appendChild(video);

		var checkFn = function (stream) {
			attachMediaStream(video, stream);

			drawCanvas(video, function (isEmpty) {
				isEmpty.should.equal(true);
				done();
			});
		};

		var errorFn = function (error) {
			throw error;
			done();
		};

		window.getUserMedia({
			video: {
				mandatory: {
	        maxFrameRate: 500
	      }
			}
		}, checkFn, errorFn);
	});

});