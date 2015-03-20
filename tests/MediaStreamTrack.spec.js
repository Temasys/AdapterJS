//mocha.bail();
//mocha.run();

var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;

var slowTimeout = window.webrtcDetectedBrowser === 'safari' || window.webrtcDetectedBrowser === 'IE' ? 5000 : 1;


describe('MediaStreamTrack: Properties', function() {
	this.slow(slowTimeout);

	var stream = null;
	var track = null;

	var catchFn = function (code, done) {
		try {
			return code();
		} catch (error) {
			throw error;
			done();
		}
	};

	before(function (done) {
		this.timeout(15000);

		window.getUserMedia({
			audio: true,
			video: true
		}, function (data) {
			stream = data;
			track = stream.polygetVideoTracks()[0];
			done();
		}, function (error) {
			throw error;
			done();
		});
	});

	it('.getSources() #static', function (done) {
		assert.typeOf(MediaStreamTrack.getSources, 'function');

		catchFn(function () {
			MediaStreamTrack.getSources(function (sources) {
				sources.length.should.least(1);
				done();
			});
		}, done);
	});

	it('.id : string', function () {
		assert.typeOf(track.id, 'string');
	});

	it('.ended : boolean', function () {
		assert.typeOf(track.ended, 'boolean')
	});

	it('.readyState : string', function () {
		assert.typeOf(track.readyState, 'string');
		track.readyState.should.equal('live');
	});

	it('.enabled : boolean', function () {
		assert.typeOf(track.enabled, 'boolean');
		track.enabled.should.equal(true);
	});

	it('.muted : boolean', function () {
		assert.typeOf(track.muted, 'boolean');
		track.muted.should.equal(false);
	});

	it('.kind : string', function () {
		assert.typeOf(track.kind, 'string');
		track.kind.should.equal('video');
		// get audio
		stream.polygetAudioTracks()[0].kind.should.equal('audio');
	});

	it('.readOnly : boolean', function () {
		assert.typeOf(track.readOnly, 'boolean');
	});

	it('.label : string', function () {
		assert.typeOf(track.label, 'string');
	});

	it('.getConstraints ()', function (done) {
		assert.typeOf(track.getConstraints, 'function');

		catchFn(function () {
			var data = track.getConstraints();
			assert.typeOf(data, 'object');
			done();
		}, done);
	});

	it('.applyConstraints ()', function (done) {
		assert.typeOf(track.applyConstraints, 'function');

		var newConstraints = {
			mandantory: {
				maxHeight: 500
			}
		};
		catchFn(function () {
			track.applyConstraints(newConstraints);
			track.getConstraints().should.equal(newConstraints);
			done();
		}, done);
	});

	it('.getSettings ()', function (done) {
		assert.typeOf(track.getSettings, 'function');

		catchFn(function () {
			var check = track.getSettings();
			assert.typeOf(check.facing, 'string');
			assert.typeOf(check.frameRate, 'number');
			done();
		}, done);
	});

	it('.states ()', function (done) {
		assert.typeOf(track.states, 'function');

		catchFn(function () {
			assert.typeOf(track.states(), 'object');
			done();
		}, done);
	});

	it('.clone ()', function (done) {
		assert.typeOf(track.clone, 'function');

		catchFn(function () {
			var clone = track.clone();
			assert.typeOf(clone, 'object');
			done();
		}, done);
	});

	it('.stop () = .polystop ()', function (done) {
		this.timeout(4000);

		assert.typeOf(track.polystop, 'function');

		catchFn(function () {
			track.polystop();
			setTimeout(function () {
				track.ended.should.equal(true);
				done();
			}, 3000);
		}, done);
	});
});