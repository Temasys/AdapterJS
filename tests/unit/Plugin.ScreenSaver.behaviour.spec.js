var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;

// Test timeouts
var testTimeout = 25000;

// Get User Media timeout
var gUMTimeout = 15000;

// Test item timeout
var testItemTimeout = 4000;

// Sleep Time
var sleepTime = 50;

// !!! THIS TEST ONLY APPLIES FOR PLUGIN-BASED BROWSERS !!!
if(webrtcDetectedBrowser === 'safari' || webrtcDetectedBrowser === 'IE') {

  describe('ScreenSaver | Behaviour', function() {
    this.timeout(testTimeout);

    /* Attributes */
    var video = null;
    var stream = null;
    var interval = null;

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
        video = attachMediaStream(video, stream);
        done();

      }, function (error) {
        throw error;
      });

    });

    afterEach(function () {
      document.body.removeChild(video);
      stream = null;

      if(interval != null) {
        clearInterval(interval);
        interval = null;
      }

    });

    it('VideoElement.isPreventingSleep :: boolean', function(done) {
      this.timeout(testItemTimeout);

      assert.typeOf(video.isPreventingSleep, 'boolean');
      expect(video.isPreventingSleep).to.equal(true);

      done();
    });

    it('VideoElement.isPreventingSleep : pause video', function (done) {
      this.timeout(testItemTimeout);

      expect(video.isPreventingSleep).to.equal(true);

      video.pause();
      expect(video.isPreventingSleep).to.equal(false);

      done();
    });

    it('VideoElement.isPreventingSleep : pause video, attach stream to a new video', function (done) {
      this.timeout(testItemTimeout);

      var video2 = document.createElement('video');
      document.body.appendChild(video2);

      expect(video.isPreventingSleep).to.equal(true);

      video.pause();
      expect(video.isPreventingSleep).to.equal(false);

      video2 = attachMediaStream(video2, stream);
      expect(video.isPreventingSleep).to.equal(true);

      document.body.removeChild(video2);
      done();
    });

    it('VideoElement.isPreventingSleep : pause video, attach stream to a new video, then pause this video', function (done) {
      this.timeout(testItemTimeout);

      var video2 = document.createElement('video');
      document.body.appendChild(video2);

      expect(video.isPreventingSleep).to.equal(true);

      video.pause();
      expect(video.isPreventingSleep).to.equal(false);

      video2 = attachMediaStream(video2, stream);
      expect(video.isPreventingSleep).to.equal(true);

      video2.pause();
      expect(video.isPreventingSleep).to.equal(false);

      document.body.removeChild(video2);
      done();
    });

    it('VideoElement.isPreventingSleep : stop stream', function (done) {
      this.timeout(testItemTimeout + sleepTime);
      

      expect(video.isPreventingSleep).to.equal(true);

      stream.stop();

      interval = setInterval(function () {
        if(!video.isPreventingSleep) {
          done();
        }
      }, sleepTime);
    });

    it('VideoElement.isPreventingSleep : attach two videos, stop stream', function (done) {
      this.timeout(testItemTimeout + sleepTime);

      var video2 = document.createElement('video');
      document.body.appendChild(video2);
      video2 = attachMediaStream(video2, stream);

      expect(video.isPreventingSleep).to.equal(true);
      expect(video2.isPreventingSleep).to.equal(true);

      stream.stop();
      document.body.removeChild(video2);

      interval = setInterval(function () {

        if(!video.isPreventingSleep && !video2.isPreventingSleep) {
          done();
        }

      }, sleepTime);
    });

    it('VideoElement.isPreventingSleep : stop stream, then play video', function (done) {
      this.timeout(testItemTimeout + sleepTime);

      expect(video.isPreventingSleep).to.equal(true);

      stream.stop();

      interval = setInterval(function () {

        if(!video.isPreventingSleep) {
          video.play();
          expect(video.isPreventingSleep).to.equal(false);
          done();
        }

      }, sleepTime);      
    });

  }); // describe('ScreenSaver | Behaviour'
} // if(webrtcDetectedBrowser === 'safari' || webrtcDetectedBrowser === 'IE') 
