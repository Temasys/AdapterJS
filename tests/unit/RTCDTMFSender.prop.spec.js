var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;

// Test timeouts
var testTimeout = 35000;

// Get User Media timeout
var gUMTimeout = 25000;

// Test item timeout
var testItemTimeout = 2000;

describe('RTCDTMFSender', function() {
  this.timeout(testTimeout);

  var pc1 = null;
  var pc2 = null;
  var audioTrack = null;
  var dtmfSender = null;

  /////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////
  /* WebRTC Object should be initialized in Safari/IE Plugin */
  before(function (done) {
    this.timeout(testItemTimeout);

    AdapterJS.webRTCReady(function() {
      window.navigator.getUserMedia({
        audio: true,
        video: false
      }, function (s) {
        stream = s;
        audioTrack = stream.getAudioTracks()[0];
        done();
      }, function (error) {
        throw error;
      });
    });
  });

  /////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////
  beforeEach(function (done) {
    this.timeout(testItemTimeout);

    pc1 = new RTCPeerConnection({ iceServers: [] });
    pc2 = new RTCPeerConnection({ iceServers: [] });
    pc1.oniceconnectionstatechange = function (state) {
      dtmfSender = pc1.createDTMFSender(audioTrack);
      if(pc1.iceConnectionState === 'connected') {
        done();
      }
    };
    pc1.addStream(stream);
    connect(pc1, pc2);
  });

  /////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////
  afterEach(function() {
    pc1.close();
    pc2.close();
    pc1 = null;
    pc2 = null;
    dtmfSender = null;
  });

  /////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////
  it('RTCDTMFSender.insertDTMF :: function', function (done) {
    this.timeout(testItemTimeout);
    assert.equal(typeof dtmfSender.insertDTMF, FUNCTION_TYPE);
    done();
  });


  /////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////
  it('RTCDTMFSender.canInsertDTMF :: bool', function (done) {
    this.timeout(testItemTimeout);
    assert.isBoolean(dtmfSender.canInsertDTMF);
    assert.isTrue(dtmfSender.canInsertDTMF);
    done();
  });


  /////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////
  it('RTCDTMFSender.track :: audioTrack', function (done) {
    this.timeout(testItemTimeout);
    assert.isDefined(dtmfSender.track);
    assert.isNotNull(dtmfSender.track);
    done();
  });

  /////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////
  it('RTCDTMFSender.toneBuffer :: string', function (done) {
    this.timeout(testItemTimeout);
    assert.isString(dtmfSender.toneBuffer);
    assert.equal(dtmfSender.toneBuffer, '');
    done();
  });

  /////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////
  it('RTCDTMFSender.duration :: int', function (done) {
    this.timeout(testItemTimeout);
    assert.isNumber(dtmfSender.duration);
    done();
  });

  /////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////
  it('RTCDTMFSender.interToneGap :: int', function (done) {
    this.timeout(testItemTimeout);
    assert.isNumber(dtmfSender.interToneGap);
    done();
  });

});
