var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;

// Test timeouts
var testTimeout = 120000;

// Get User Media timeout
var gUMTimeout = 15000;

// Test item timeout
var testItemTimeout = 120000;

// Stress test, popping plugin elements in and out 'POP_REQUESTS' times
var POP_REQUESTS = 20;

// !!! THIS TEST ONLY APPLIES FOR PLUGIN-BASED BROWSERS !!!
if(webrtcDetectedBrowser === 'safari' || webrtcDetectedBrowser === 'IE') {

  describe('Plugin Object | Stability', function() {
    this.timeout(testTimeout);

    /* Attributes */
    var video = null;
    var stream = null;

    /* WebRTC Object should be initialized in Safari/IE Plugin */
    before(function (done) {
      this.timeout(gUMTimeout);

      AdapterJS.webRTCReady(function() { 
        done();
      });
    });

    beforeEach(function (done) {
      this.timeout(gUMTimeout);

      window.navigator.getUserMedia({
        audio: true,
        video: true

      }, function (data) {
        stream = data;
        video = document.createElement('video');
        document.body.appendChild(video);
        done();

      }, function (error) {
        throw error;
      });

    });

    afterEach(function () {
      document.body.removeChild(video);
      stream = null;
    });

    it('Pop element N times', function(done) {
      this.timeout(testItemTimeout);

      var popCount = 0;

      var onplayHandler = function() {
        if (++popCount >= POP_REQUESTS) {
          done();
        } else {
          replaceVideoElement();
        }
      }
      var replaceVideoElement = function() {
        document.body.removeChild(video);
        video = document.createElement('video');
        document.body.appendChild(video);
        video.onplay = onplayHandler ;
        video = attachMediaStream(video, stream);
        expect(video.valid).to.equal(true);
      };
      replaceVideoElement();
    });

  }); // describe('Plugin Object | Stability'
}
