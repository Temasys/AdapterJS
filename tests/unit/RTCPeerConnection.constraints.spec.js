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

// TODO(J-O): Where are the assertions ? Is this even testing anything ?

describe('RTCPeerConnection | RTCConfiguration', function() {
  this.timeout(testTimeout);

  var peer = null;

  /* WebRTC Object should be initialized in Safari/IE Plugin */
  before(function (done) {
    this.timeout(testItemTimeout);

    AdapterJS.webRTCReady(function() {
      done();
    });
  });

  /////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////
  afterEach(function(done) {
    peer = null;
    done();
  });

  var makeDesc = function (config, constraints) {
    var description = 'new RTCPeerConnection(';
    if (config !== undefined) {
      description += JSON.stringify(config);
    }
    if (constraints !== undefined) {
      description += ', ' + JSON.stringify(constraints);
    }
    description += ')';

    return description;
  };

  var testRTCPCContruct = function (config, constraints) {
    var description = makeDesc(config, constraints);
    it(description, function () {
      this.timeout(testItemTimeout);

      var peer = new RTCPeerConnection(config, constraints);
    });
  };

  var testRTCPCContruct_skip = function (config, constraints) {
    var description = makeDesc(config, constraints);
    it.skip(description, function () {
      this.timeout(testItemTimeout);

      var peer = new RTCPeerConnection(config, constraints);
    });
  };

  var testRTCPCContruct_throw = function (config, constraints) {
    var description = makeDesc(config, constraints);
    description += ' -> Throws Error';
    it(description, function () {
      this.timeout(testItemTimeout);

      var fn = function() {
        var peer = new RTCPeerConnection(config, constraints);
      };

      expect(fn).to.throw(Error);
    });
  };

  // EXPECT WORKING
  testRTCPCContruct();
  testRTCPCContruct(null);
  testRTCPCContruct(null, []);
  testRTCPCContruct(null, {});
  testRTCPCContruct(null, null);
  testRTCPCContruct(null, null, null);
  testRTCPCContruct(null, null, 0);
  testRTCPCContruct(null, null, 1);
  testRTCPCContruct(null, null, true);
  testRTCPCContruct(null, null, false);
  testRTCPCContruct(null, null, 'test');
  testRTCPCContruct(null, null, {});
  testRTCPCContruct(null, null, []);
  testRTCPCContruct(null, null, { test: [] });
  testRTCPCContruct({ iceServers: [] });
  testRTCPCContruct({ iceServers: [{ url: 'turn:numb.viagenie.ca', username: 'leticia.choo@temasys.com.sg', credential: 'xxxxx' }] });
  testRTCPCContruct({ iceServers: [{ url: 'leticia.choo@temasys.com.sg@turn:numb.viagenie.ca', credential: 'xxxxx' }] });
  testRTCPCContruct({ iceServers: [{ urls: ['turn:numb.viagenie.ca', 'turn:numb.viagenie.ca'], username: 'leticia.choo@temasys.com.sg', credential: 'xxxxx' }] });
  testRTCPCContruct({ iceServers: [{ url: 'stun:stun.l.google.com:19302' }] });
  testRTCPCContruct({ iceServers: [{ url: 'turn:numb.viagenie.ca', username: 'leticia.choo@temasys.com.sg', credential: 'xxxxx' }, { url: 'stun:stun.l.google.com:19302' }] });
  testRTCPCContruct({ iceServers: [] }, { optional: [{ DtlsSrtpKeyAgreement: true }] });
  testRTCPCContruct({ iceServers: [] }, {});
  testRTCPCContruct({ iceServers: [] }, { optional: [] });
  testRTCPCContruct({ iceServers: [] }, { optional: undefined });
  testRTCPCContruct({ iceServers: [] }, { optional: null });
  testRTCPCContruct({ iceServers: [] }, { mandatory: {} });
  testRTCPCContruct({ iceServers: [] }, { mandatory: undefined });
  testRTCPCContruct({ iceServers: [] }, { mandatory: null });
  testRTCPCContruct({ iceServers: [] }, { optional: [], mandatory: {} });
  testRTCPCContruct({ iceServers: [] }, { optional: [], mandatory: null });

  // EXPECT THROWNIG ERROR
  testRTCPCContruct_throw(1);
  testRTCPCContruct_throw(0);
  testRTCPCContruct_throw(true);
  testRTCPCContruct_throw(false);
  testRTCPCContruct_throw('test');
  testRTCPCContruct_throw({});
  testRTCPCContruct_throw({ iceServers: null });
  testRTCPCContruct_throw({ iceServers: '' });
  testRTCPCContruct_throw({ iceServers: true });
  testRTCPCContruct_throw(null, 1);
  testRTCPCContruct_throw(null, 0);
  testRTCPCContruct_throw(null, true);
  testRTCPCContruct_throw(null, false);
  testRTCPCContruct_throw(null, 'test');
  testRTCPCContruct_throw(null, { optional: 1 });
  testRTCPCContruct_throw(null, { optional: 0 });
  testRTCPCContruct_throw(null, { optional: 'test' });
  testRTCPCContruct_throw(null, { optional: true });
  testRTCPCContruct_throw(null, { optional: false });
  testRTCPCContruct_throw(null, { optional: {} }); // Should throw error as there are plugin failures
  testRTCPCContruct_throw({ iceServers: [] }, { mandatory: [] });
  testRTCPCContruct_throw({ iceServers: [] }, { mandatory: 'test'});
  testRTCPCContruct_throw({ iceServers: [] }, { mandatory: 1 });
  testRTCPCContruct_throw({ iceServers: [] }, { mandatory: 0 });
  testRTCPCContruct_throw({ iceServers: [] }, { optional: 'test', mandatory: [] });
  testRTCPCContruct_throw({ iceServers: [] }, { optional: [], mandatory: 'test' });

  // SKIP TEST
  testRTCPCContruct_skip({ bundlePolicy: 'balanced' });
  testRTCPCContruct_skip({ bundlePolicy: 'max-compat' });
  testRTCPCContruct_skip({ bundlePolicy: 'max-bundle' });
  testRTCPCContruct_skip({ iceTransportPolicy: 'none' });
  testRTCPCContruct_skip({ iceTransportPolicy: 'relay' });
  testRTCPCContruct_skip({ iceTransportPolicy: 'all' });

});