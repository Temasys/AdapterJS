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
    this.timeout(gUMTimeout);

  	AdapterJS.webRTCReady(function() { 
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
      });
  	});
  });

  beforeEach(function (done) {
    this.timeout(testTimeout);

    video = document.createElement('video');
    if (webrtcDetectedBrowser !== 'IE') {
      video.autoplay = 'autoplay';
    }
    document.body.appendChild(video);
    video = attachMediaStream(video, stream);
    done();
  });

  it('VideoElement.muted : mute one rendered stream', function (done) {
    this.timeout(testItemTimeout);

    expect(video.muted).to.equal(false);
    expect(audioTrack.enabled).to.equal(true);

    video.muted = true;

    expect(video.muted).to.equal(true);
    expect(audioTrack.enabled).to.equal(true);

    video.muted = false;

    expect(video.muted).to.equal(false);
    expect(audioTrack.enabled).to.equal(true);

    video.muted = true;

    done();
  });

  it('VideoElement.muted : mute stream rendered several times', function (done) {
    this.timeout(testItemTimeout);

    var video2 = document.createElement('video');
    if (webrtcDetectedBrowser !== 'IE') {
      video2.autoplay = 'autoplay';
    }
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
    expect(audioTrack.enabled).to.equal(true);

    video.muted = false;

    expect(video.muted).to.equal(false);
    expect(video2.muted).to.equal(true);
    expect(audioTrack.enabled).to.equal(true);

    video.muted = true;

    document.body.removeChild(video2);
    done();
  });

  it('VideoElement.muted : mute then attach other video to stream', function (done) {
    var video2 = document.createElement('video');
    if (webrtcDetectedBrowser !== 'IE') {
      video2.autoplay = 'autoplay';
    }    
    document.body.appendChild(video2);

    expect(audioTrack.enabled).to.equal(true);
    video.muted = true;

    expect(video.muted).to.equal(true);
    expect(video2.muted).to.equal(false);
    expect(audioTrack.enabled).to.equal(true);

    video2 = attachMediaStream(video2, stream);

    expect(audioTrack.enabled).to.equal(true);

    document.body.removeChild(video2);
    done();
  });

  afterEach(function () {
    document.body.removeChild(video);
  });


});