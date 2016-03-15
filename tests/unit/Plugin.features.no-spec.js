var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;

// Test timeouts
var testTimeout = 120000;

// Get User Media timeout
var gUMTimeout = 15000;

// Test item timeout
var testItemTimeout = 5000;

// !!! THIS TEST ONLY APPLIES FOR PLUGIN-BASED BROWSERS !!!
if(webrtcDetectedBrowser === 'safari' || webrtcDetectedBrowser === 'IE') {

  describe('Plugin Features | Out of spec', function() {
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

    it('getFrame', function(done) {
      this.timeout(testTimeout);
      video.onplay = function(e) {
        assert.isNotNull(video.getFrame);
        // assert.typeOf(video.getFrame, 'function');

        var canvas = document.createElement('canvas');
        document.body.appendChild(canvas);

        var base64 = video.getFrame();
        assert.isString(base64);
        expect(base64).to.have.length.above(1000);

        var img = new Image();
        img.onload = function () {
          canvas.getContext('2d').
          drawImage(img, 0, 0, canvas.width, canvas.height);
          done();
        };
        img.setAttribute('src', 'data:image/png;base64,' + base64);
        
      };
      video = attachMediaStream(video, stream);
    });

  }); // describe('Plugin Object | Stability'
} // if(webrtcDetectedBrowser === 'safari' || webrtcDetectedBrowser === 'IE') 
