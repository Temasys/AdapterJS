//mocha.bail();
//mocha.run();

var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;

// Test timeouts
var testTimeout = 25000;

// Get User Media timeout
var gUMTimeout = 15000;

// Test item timeout
var testItemTimeout = 4000;


describe('MediaStream | Properties', function() {
	this.timeout(testTimeout);

	/* Attributes */
	var stream = null;
	var track = null;

	var checkRemoveTrackSuccess = false;

	/* Get User Media */
	before(function (done) {
		this.timeout(gUMTimeout);

		if (window.webrtcDetectedBrowser !== 'IE' && window.webrtcDetectedBrowser !== 'Safari') {
			AdapterJS.onwebrtcreadyDone = true;
		}

		var getMedia = function () {
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
		};

		if (!AdapterJS.onwebrtcreadyDone) {
			AdapterJS.onwebrtcready = getMedia;

		} else {
			getMedia();
		}
	});

	it('MediaStream.id :: string', function () {
		this.timeout(testItemTimeout);

		assert.typeOf(stream.id, 'string');
	});

	it('MediaStream.ended :: boolean', function () {
		this.timeout(testItemTimeout);

		assert.typeOf(stream.ended, 'boolean')
	});

	it('MediaStream.clone :: method', function (done) {
		this.timeout(testItemTimeout);

		assert.typeOf(stream.clone, 'function');

		try {
			var clone = stream.clone();
			assert.typeOf(clone, 'object');
			done();

		} catch (error) {
			throw error;
			done();
		}
	});

	it('MediaStream.polyremoveTrack -> MediaStream.removeTrack :: method', function (done) {
		this.timeout(testItemTimeout);

		assert.typeOf(stream.polyremoveTrack, 'function');

		try {
			stream.polyremoveTrack(track);
			checkRemoveTrackSuccess = stream.getAudioTracks().length === 0;

			stream.getAudioTracks().length.should.equal(0);
			done();

		} catch (error) {
			throw error;
			done();
		}
	});

	it('MediaStream.polyaddTrack -> MediaStream.addTrack :: method', function (done) {
		this.timeout(testItemTimeout);

		assert.typeOf(stream.polyaddTrack, 'function');

		try {
			stream.polyaddTrack(track);

			if (checkRemoveTrackSuccess) {
				stream.getAudioTracks().length.should.equal(1);
			} else {
				assert.fail(checkRemoveTrackSuccess, true, 'Remove track failed. Unable to proceed checking of addTrack');
			}
			done();

		} catch (error) {
			throw error;
			done();
		}
	});

	it('MediaStream.polygetTrackById -> MediaStream.getTrackById :: method', function (done) {
		this.timeout(testItemTimeout);

		assert.typeOf(stream.polygetTrackById, 'function');

		try {
			var check = stream.polygetTrackById(track.id);

			if (check === track) {
				assert.ok(check, 'Track received is correct');
			} else {
				assert.fail(check, track, 'Track received is incorrect');
			}

			done();

		} catch (error) {
			throw error;
			done();
		}
	});

	it('MediaStream.polystop -> MediaStream.stop :: method', function (done) {
		this.timeout(testItemTimeout + 1000);

		assert.typeOf(stream.polystop, 'function');

		try {
			stream.polystop();

			setTimeout(function () {
				stream.ended.should.equal(true);
				done();
			}, 2500);

		} catch (error) {
			throw error;
			done();
		}
	});
});