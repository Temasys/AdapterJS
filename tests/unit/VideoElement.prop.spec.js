var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;

// Test timeouts
var testTimeout = 25000;

// Get User Media timeout
var gUMTimeout = 15000;

// Test item timeout
var testItemTimeout = 4000;


describe('VideoElement | Properties', function() {
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

  it('VideoElement.muted :: boolean', function(done) {
    this.timeout(testItemTimeout);

    assert.typeOf(video.muted, 'boolean');
    expect(video.muted).to.equal(false);

    video.muted = true;
    expect(video.muted).to.equal(true);

    done();
  });

  afterEach(function () {
    document.body.removeChild(video);
  });
});

  
