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


describe('RTCPeerConnection | RTCConfiguration', function() {
  this.timeout(testTimeout);

  /* WebRTC Object should be initialized in Safari/IE Plugin */
  before(function (done) {
    this.timeout(testItemTimeout);

    AdapterJS.webRTCReady(function() {
      done();
    });
  });

  (function (constraints) {

    it('new RTCPeerConnection(' + JSON.stringify(constraints) + ')', function () {
      this.timeout(testItemTimeout);

      var peer = new RTCPeerConnection(constraints);
    });

  })({ iceServers: [] });


  (function (constraints) {

    it('new RTCPeerConnection(' + JSON.stringify(constraints) + ')', function () {
      this.timeout(testItemTimeout);

      var peer = new RTCPeerConnection(constraints);
    });

  })({ iceServers: [{ url: 'turn:numb.viagenie.ca', username: 'leticia.choo@temasys.com.sg', credential: 'xxxxx' }] });


  (function (constraints) {

    it('new RTCPeerConnection(' + JSON.stringify(constraints) + ')', function () {
      this.timeout(testItemTimeout);

      var peer = new RTCPeerConnection(constraints);
    });

  })({ iceServers: [{ url: 'leticia.choo@temasys.com.sg@turn:numb.viagenie.ca', credential: 'xxxxx' }] });


  (function (constraints) {

    it('new RTCPeerConnection(' + JSON.stringify(constraints) + ')', function () {
      this.timeout(testItemTimeout);

      var peer = new RTCPeerConnection(constraints);
    });

  })({ iceServers: [{ urls: ['turn:numb.viagenie.ca', 'turn:numb.viagenie.ca'], username: 'leticia.choo@temasys.com.sg', credential: 'xxxxx' }] });


  (function (constraints) {

    it('new RTCPeerConnection(' + JSON.stringify(constraints) + ')', function () {
      this.timeout(testItemTimeout);

      var peer = new RTCPeerConnection(constraints);
    });

  })({ iceServers: [{ url: 'stun:stun.l.google.com:19302' }] });


  (function (constraints) {

    it('new RTCPeerConnection(' + JSON.stringify(constraints) + ')', function () {
      this.timeout(testItemTimeout);

      var peer = new RTCPeerConnection(constraints);
    });

  })({ iceServers: [{ url: 'turn:numb.viagenie.ca', username: 'leticia.choo@temasys.com.sg', credential: 'xxxxx' }, { url: 'stun:stun.l.google.com:19302' }] });


  (function (constraints) {

    it.skip('new RTCPeerConnection(' + JSON.stringify(constraints) + ')', function () {});

  })({ bundlePolicy: 'balanced' });


  (function (constraints) {

    it.skip('new RTCPeerConnection(' + JSON.stringify(constraints) + ')', function () {});

  })({ bundlePolicy: 'max-compat' });


  (function (constraints) {

    it.skip('new RTCPeerConnection(' + JSON.stringify(constraints) + ')', function () {});

  })({ bundlePolicy: 'max-bundle' });


  (function (constraints) {

    it.skip('new RTCPeerConnection(' + JSON.stringify(constraints) + ')', function () {});

  })({ iceTransportPolicy: 'none' });


  (function (constraints) {

    it.skip('new RTCPeerConnection(' + JSON.stringify(constraints) + ')', function () {});

  })({ iceTransportPolicy: 'relay' });


  (function (constraints) {

    it.skip('new RTCPeerConnection(' + JSON.stringify(constraints) + ')', function () {});

  })({ iceTransportPolicy: 'all' });


  (function (constraints, optional) {

    it('new RTCPeerConnection(' + JSON.stringify(constraints) + ', ' + JSON.stringify(optional) + ')', function () {
      this.timeout(testItemTimeout);

      var peer = new RTCPeerConnection(constraints, optional);
    });

  })({ iceServers: [] }, { optional: [{ DtlsSrtpKeyAgreement: true }] });
});