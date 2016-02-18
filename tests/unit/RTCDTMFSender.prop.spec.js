var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;

// Test timeouts
var testTimeout = 35000;

// Get User Media timeout
var gUMTimeout = 5000;

// Test item timeout
var testItemTimeout = 2000;

describe('RTCDTMFSender | prop', function() {
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
  it('RTCDTMFSender.insertDTMF :: function', function (done) {
    this.timeout(testItemTimeout);
    assert.equal(typeof dtmfSender.insertDTMF, FUNCTION_TYPE);
    done();
  });

  /////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////
  it('RTCDTMFSender.insertDTMF :: success returns true', function (done) {
    this.timeout(testItemTimeout);
    assert.isTrue(dtmfSender.insertDTMF('', 100, 100));
    assert.isTrue(dtmfSender.insertDTMF('13,1', 100, 100));
    assert.isTrue(dtmfSender.insertDTMF(',,,', 200, 100));
    done();
  });

  /////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////
  it('RTCDTMFSender.insertDTMF :: failure returns false', function (done) {
    this.timeout(testItemTimeout);
    assert.isFalse(dtmfSender.insertDTMF('13,1', 10, 100));
    assert.isFalse(dtmfSender.insertDTMF('13,1', 100, 10));
    done();
  });

  /////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////
  it('RTCDTMFSender.insertDTMF :: edge values', function (done) {
    this.timeout(testItemTimeout);
    assert.isTrue(dtmfSender.insertDTMF('1', 70, 100),    'on low duration egde');
    assert.isTrue(dtmfSender.insertDTMF('1', 6000, 100),  'on high duration egde');
    assert.isTrue(dtmfSender.insertDTMF('1', 100, 50),    'low gap edge');

    assert.isFalse(dtmfSender.insertDTMF('1', 69, 100),   'under duration egde');
    assert.isFalse(dtmfSender.insertDTMF('1', 6001, 100), 'over duration egde');
    assert.isFalse(dtmfSender.insertDTMF('1', 100, 49),   'under gap edge');
    done();
  });

  /////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////
  it('RTCDTMFSender.insertDTMF :: default arguments', function (done) {
    this.timeout(testItemTimeout);
    var e = /.*/;
    assert.doesNotThrow(function(){dtmfSender.insertDTMF('1', 100);}, e, 'default gap, does not throw');
    assert.doesNotThrow(function(){dtmfSender.insertDTMF('1');}, e, 'default duration, does not throw');
    assert.throws(function(){dtmfSender.insertDTMF();}, e, 'Missing tones, throws');

    assert.isTrue(dtmfSender.insertDTMF('1', 100), 'default gap');
    assert.isTrue(dtmfSender.insertDTMF('1'), 'default duration');
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
