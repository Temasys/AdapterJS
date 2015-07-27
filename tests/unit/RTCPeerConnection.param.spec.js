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
var testItemTimeout = 2000;


describe('RTCPeerConnection | Parameters', function() {
  this.timeout(testTimeout);

  /* WebRTC Object should be initialized in Safari/IE Plugin */
  before(function (done) {
    this.timeout(testItemTimeout);

    AdapterJS.webRTCReady(function() {
      done();
    });
  });

  it('new RTCPeerConnection() -> Error', function () {
    this.timeout(testItemTimeout);

    expect(function () {
      var peer = new RTCPeerConnection();
    }).to.throw(Error);
  });

  it('new RTCPeerConnection(null) -> Error', function () {
    this.timeout(testItemTimeout);

    expect(function () {
      var peer = new RTCPeerConnection(null);
    }).to.throw(Error);
  });

  it('new RTCPeerConnection({}) -> undefined', function () {
    this.timeout(testItemTimeout);

    expect(function () {
      var peer = new RTCPeerConnection({});
    }).to.not.throw(Error);
  });

  it('new RTCPeerConnection({}, null) -> undefined', function () {
    this.timeout(testItemTimeout);

    expect(function () {
      var peer = new RTCPeerConnection({}, null);
    }).to.not.throw(Error);
  });

  it('new RTCPeerConnection({}, {}) -> undefined', function () {
    this.timeout(testItemTimeout);

    expect(function () {
      var peer = new RTCPeerConnection({}, {});
    }).to.not.throw(Error);
  });

  it('new RTCPeerConnection(null, null) -> undefined', function () {
    this.timeout(testItemTimeout);

    expect(function () {
      var peer = new RTCPeerConnection(null, null);
    }).to.not.throw(Error);
  });
});