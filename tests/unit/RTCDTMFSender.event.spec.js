var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;

// Test timeouts
var testTimeout = 3500;

// Get User Media timeout
var gUMTimeout = 5000;

// Test item timeout
var testItemTimeout = 2000;

describe('RTCDTMFSender | event', function() {
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
    this.timeout(gUMTimeout);

    pc1 = new RTCPeerConnection({ iceServers: [] });
    pc2 = new RTCPeerConnection({ iceServers: [] });
    pc1.oniceconnectionstatechange = function (evt) {
      if(pc1 && pc1.iceConnectionState === 'connected') {
        dtmfSender = pc1.createDTMFSender(audioTrack);
        done();
      }
    };
    pc1.addStream(stream);
    connect(pc1, pc2);
  });

  /////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////
  afterEach(function(done) {
    pc1.close();
    pc2.close();
    pc1 = null;
    pc2 = null;
    dtmfSender = null;
    done();
  });

  /////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////
  it('RTCDTMFSender.ontonechange :: emit', function (done) {
    this.timeout(testItemTimeout);
    var emitTone = '8';

    dtmfSender.ontonechange = function(evt) {
      assert.isNotNull(evt,               'Event argument missing');
      assert.isNotNull(evt.target,        'Event target missing');
      assert.isNotNull(evt.currentTarget, 'Event currentTarget missing');
      assert.isNotNull(evt.srcElement,    'Event srcElement missing');
      assert.isNotNull(evt.tone,          'Event tone missing');
      assert.equal(evt.tone, emitTone,    'Wrong tone sent');
      
      done();
    };

    dtmfSender.insertDTMF(emitTone, 100, 100);
  });

});
