//mocha.bail();
//mocha.run();

var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;

var slowTimeout = window.webrtcDetectedBrowser === 'safari' || window.webrtcDetectedBrowser === 'IE' ? 5000 : 1;


describe('MediaStream: Properties', function() {
	this.slow(slowTimeout);

	var stream = null;
	var track = null;
	var removeTrackSuccess = false;

	var catchFn = function (code, done) {
		try {
			return code();
		} catch (error) {
			throw error;
			done();
		}
	};

	before(function (done) {
		this.timeout(5000);

		window.getUserMedia({
			audio: true,
			video: true
		}, function (data) {
			stream = data;
			track = stream.polygetAudioTracks()[0];
			done();
		}, function (error) {
			throw error;
			done();
		});
	});

	it('.id : string', function () {
		assert.typeOf(stream.id, 'string');
	});

	it('.ended : boolean', function () {
		assert.typeOf(stream.ended, 'boolean')
	});

	it('.clone ()', function (done) {
		assert.typeOf(stream.clone, 'function');

		catchFn(function () {
			var clone = stream.clone();
			assert.typeOf(clone, 'object');
			done();
		}, done);
	});

	it('.removeTrack () = .polyremoveTrack ()', function (done) {
		assert.typeOf(stream.polyremoveTrack, 'function');

		catchFn(function () {
			stream.polyremoveTrack(track);
			removeTrackSuccess = stream.getAudioTracks().length === 0;

			stream.getAudioTracks().length.should.equal(0);
			done();
		}, done);
	});

	it('.addTrack () = .polyaddTrack ()', function (done) {
		assert.typeOf(stream.polyaddTrack, 'function');

		catchFn(function () {
			stream.polyaddTrack(track);

			if (removeTrackSuccess) {
				stream.getAudioTracks().length.should.equal(1);
			} else {
				assert.fail(removeTrackSuccess, true, 'Remove track failed. Unable to proceed checking of addTrack');
			}
			done();
		}, done);
	});

	it('.getTrackById () = .polygetTrackById () ', function (done) {
		assert.typeOf(stream.polygetTrackById, 'function');

		catchFn(function () {
			var check = stream.polygetTrackById(track.id);
			check.should.equal(track);
			done();
		}, done);
	});

	it('.stop () = .polystop ()', function (done) {
		this.timeout(4000);

		assert.typeOf(stream.polystop, 'function');

		catchFn(function () {
			stream.polystop();

			setTimeout(function () {
				stream.ended.should.equal(true);
				done();
			}, 2000);
		}, done);
	});
});