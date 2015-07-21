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

	/* WebRTC Object should be initialized in Safari/IE Plugin */
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

	/* Get User Media */
	before(function (done) {
		this.timeout(gUMTimeout);

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
	});

	it('MediaStream.id :: string', function () {
		this.timeout(testItemTimeout);

		assert.typeOf(stream.id, 'string');

		var regex = /^[\u0021\u0023-\u0027\u002A-\u002B\u002D-\u002E\u0030-\u0039\u0041-\u005A\u005E-\u007E]*$/;

		expect(stream.id).to.have.length(36);
		expect(stream.id).to.match(regex);
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

		expect(stream.getAudioTracks()).to.have.length(0);
	});

	it('MediaStream.polyaddTrack -> MediaStream.addTrack :: method', function () {
		this.timeout(testItemTimeout);

		assert.typeOf(stream.polyaddTrack, 'function');

		stream.polyaddTrack(track);

		if (!checkRemoveTrackSuccess) {
			throw new Error('Remove track failed. Unable to proceed checking of addTrack');
		}

		expect(stream.getAudioTracks()).to.have.length(1);
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

		expect(tracks).to.have.length(2);
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

	it('MediaStream.addTrack && MediaStream.removeTrack -> Error < When > MediaStream.ended === true', function () {
		this.timeout(testItemTimeout);

		expect(function () {
			stream.polyaddTrack(track);
		}).to.throw(Error);

		expect(function () {
			stream.polyremoveTrack(track);
		}).to.throw(Error);
	});
});