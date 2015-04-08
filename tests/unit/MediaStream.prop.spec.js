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
			window.navigator.getUserMedia({
				audio: true,
				video: true

			}, function (data) {
				stream = data;
				track = data.polygetAudioTracks()[0];
				done();

			}, function (error) {
				throw error;
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

	it('MediaStream.clone :: method', function () {
		this.timeout(testItemTimeout);

		assert.typeOf(stream.clone, 'function');

		var clone = stream.clone();
		assert.typeOf(clone, 'object');
	});

	it('MediaStream.polyremoveTrack -> MediaStream.removeTrack :: method', function () {
		this.timeout(testItemTimeout);

		assert.typeOf(stream.polyremoveTrack, 'function');

		stream.polyremoveTrack(track);

		checkRemoveTrackSuccess = stream.getAudioTracks().length === 0;

		expect(stream.getAudioTracks().length).to.equal(0);
	});

	it('MediaStream.polyaddTrack -> MediaStream.addTrack :: method', function () {
		this.timeout(testItemTimeout);

		assert.typeOf(stream.polyaddTrack, 'function');

		stream.polyaddTrack(track);

		if (!checkRemoveTrackSuccess) {
			throw new Error('Remove track failed. Unable to proceed checking of addTrack');
		}

		expect(stream.getAudioTracks().length).to.equal(1);
	});

	it('MediaStream.polygetTrackById -> MediaStream.getTrackById :: method', function () {
		this.timeout(testItemTimeout);

		assert.typeOf(stream.polygetTrackById, 'function');

		var check = stream.polygetTrackById(track.id);

		expect(check).to.equal(track);
	});

	it('MediaStream.polygetTracks -> MediaStream.getTracks :: method', function () {
		this.timeout(testItemTimeout);

		assert.typeOf(stream.polygetTracks, 'function');

		var tracks = stream.polygetTracks(track.id);

		if (!(tracks instanceof Array)) {
			throw new Error('Received track type is not an array');
		}

		expect(tracks.length).to.equal(2);
	});

	it('MediaStream.polystop -> MediaStream.stop :: method', function (done) {
		this.timeout(testItemTimeout + 2500);

		assert.typeOf(stream.polystop, 'function');

		stream.polystop();

		setTimeout(function () {
			expect(stream.ended).to.equal(true);
			done();
		}, 2500);
	});
});