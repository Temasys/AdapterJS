var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;

// Test timeouts
var testTimeout = 25000;

// Get User Media timeout
var gUMTimeout = 15000;

// Test item timeout
var testItemTimeout = 4000;


describe('VideoElement| Behaviour', function() {
	this.timeout(testTimeout);

	/* Attributes */
	var video = null;
	var stream = null;
	var audioTrack = null;
	var videoTrack = null;

	/* WebRTC Object should be initialized in Safari/IE Plugin */
	before(function (done) {
		this.timeout(testItemTimeout);

		AdapterJS.webRTCReady(function() {
			done();
		});
	});

	/* Get User Media */
	before(function (done) {
		this.timeout(gUMTimeout);

		window.navigator.getUserMedia({
			audio: true,
			video: true

		}, function (data) {
			stream = data;
			videoTrack = stream.getVideoTracks()[0];
			audioTrack = stream.getAudioTracks()[0];
			done();

		}, function (error) {
			throw error;
			// done();
		});
	});

	beforeEach(function (done) {
		this.timeout(testTimeout);

		video = document.createElement('video');
		video.autoplay = 'autoplay';
		document.body.appendChild(video);
		video = attachMediaStream(video, stream);
		done();
	});

	afterEach(function (done) {
		this.timeout(testTimeout);

		document.body.removeChild(video);

		done();

	});

	it('VideoElement.muted : mute one rendered stream', function (done) {
		this.timeout(testItemTimeout);

		expect(video.muted).to.equal(false);
		expect(audioTrack.enabled).to.equal(true);

		video.muted = true;

		expect(video.muted).to.equal(true);
		expect(audioTrack.enabled).to.equal(false);

		video.muted = false;

		expect(video.muted).to.equal(false);
		expect(audioTrack.enabled).to.equal(true);

		done();
	});

	it('VideoElement.muted : mute stream rendered several times', function (done) {
		this.timeout(testItemTimeout);

		var video2 = document.createElement('video');
		video2.autoplay = 'autoplay';
		document.body.appendChild(video2);
		video2 = attachMediaStream(video2, stream);

		expect(video.muted).to.equal(false);
		expect(video2.muted).to.equal(false);
		expect(audioTrack.enabled).to.equal(true);

		video.muted = true;

		expect(video.muted).to.equal(true);
		expect(video2.muted).to.equal(false);
		expect(audioTrack.enabled).to.equal(true);

		video2.muted = true;

		expect(video.muted).to.equal(true);
		expect(video2.muted).to.equal(true);
		//expect(audioTrack.enabled).to.equal(false);

		video.muted = false;

		expect(video.muted).to.equal(false);
		expect(video2.muted).to.equal(true);
		expect(audioTrack.enabled).to.equal(true);

		document.body.removeChild(video2);
		console.log(audioTrack.enabled);
		done();
	});

	it('VideoElement.muted : mute then attach other video to stream', function (done) {
		var video2 = document.createElement('video');
		video2.autoplay = 'autoplay';
		document.body.appendChild(video2);

		video.muted = true;
		console.log(audioTrack.enabled);

		expect(video.muted).to.equal(true);
		expect(video2.muted).to.equal(false);
		expect(audioTrack.enabled).to.equal(false);

		video2 = attachMediaStream(video2, stream);

		expect(audioTrack.enabled).to.equal(true);

		document.body.removeChild(video2);

		done();
	});

});