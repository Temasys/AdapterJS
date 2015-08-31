//mocha.bail();
//mocha.run();

var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;

// Test timeouts
var testTimeout = 35000;

// Get User Media timeout
var gUMTimeout = 25000;

// Test item timeout
var testItemTimeout = 4000;

var timeStampMaxError = 60000;


describe('VideoElement | EventHandler', function() {
  this.timeout(testTimeout);

  /* Attributes */
  var stream = null;
  var video = null;

  /* WebRTC Object should be initialized in Safari/IE Plugin */
  before(function (done) {
    this.timeout(testItemTimeout);

    AdapterJS.webRTCReady(function() {
      done();
    });
  });

  /* Get User Media */
  beforeEach(function (done) {
    this.timeout(gUMTimeout);

    window.navigator.getUserMedia({
      audio: true,
      video: true

    }, function (data) {
      stream = data;

      done();

    }, function (error) {
      throw error;
    });

    video = document.createElement('video');
    video.autoplay = 'autoplay';
    document.body.appendChild(video);

  });

  afterEach(function() {
    document.body.removeChild(video);
    stream = null;
  });

  it('VideoElement.onplaying :: emit', function (done) {
    this.timeout(testItemTimeout);
    video.id = 'id';

    video.onplaying = function(event) {
      done();
    }

    video = attachMediaStream(video, stream);    
  });

  it('VideoElement.onplaying :: attributes', function (done) {
    this.timeout(testItemTimeout);
    video.id = 'video';

    var now = new Date().getTime();

    video.onplaying = function(event) {
      expect(event.target).not.to.be.undefined;
      expect(event.currentTarget).not.to.be.undefined;
      expect(event.srcElement).not.to.be.undefined;
      expect(event.timeStamp).not.to.be.undefined;

      expect(event.timeStamp).to.be.above(0);
      expect(event.timeStamp).to.be.within(now - timeStampMaxError, now + timeStampMaxError);
      expect(event.target.id).to.equal('video');
      expect(event.srcElement.id).to.equal('video');
      expect(event.currentTarget.id).to.equal('video');

      done();
    };

    video = attachMediaStream(video, stream);
  });

  it('VideoElement.onplay :: emit', function (done) {
    this.timeout(testItemTimeout);

    var onPlayCaught = 0;
    var expectedOnplayCaught = 2;

    video.onplay = function() {
      if(++onPlayCaught == expectedOnplayCaught) {
        done();
      }
      video.pause();
      video.play();
    }

    video = attachMediaStream(video, stream);
  });

  it('VideoElement.onplay :: attributes', function(done) {
    this.timeout(testItemTimeout);
    video.id = 'video';

    var now = new Date().getTime();

    video.onplay = function(event) {
      expect(event.target).not.to.be.undefined;
      expect(event.currentTarget).not.to.be.undefined;
      expect(event.srcElement).not.to.be.undefined;
      expect(event.timeStamp).not.to.be.undefined;

      expect(event.timeStamp).to.be.above(0);
      expect(event.timeStamp).to.be.within(now - timeStampMaxError, now + timeStampMaxError);
      expect(event.target.id).to.equal('video');
      expect(event.srcElement.id).to.equal('video');
      expect(event.currentTarget.id).to.equal('video');

      done();
    };

    video = attachMediaStream(video, stream);

  });

});


