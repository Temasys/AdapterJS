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

// Parse the constraints of getUserMedia
var printJSON = function (obj, spaces) {
  spaces = typeof spaces !== 'number' ? 2 : spaces;

  // make indentation
  var makeIndentation = function (spaces) {
    var str = '';
    var i;

    for (i = 0; i < spaces; i += 1) {
      str += ' ';
    }

    return str;
  };

  var opening = '{';
  var closing = '}';

  if (obj instanceof Array) {
    opening = '[';
    closing = ']';
  }

  // parse object
  var outputStr = makeIndentation(spaces - 2) + opening;
  var val;


  if (!(obj instanceof Array)) {
    var key;

    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        outputStr += '\n\t' + makeIndentation(spaces) + '"' + key + '": ';

        val = obj[key];

        if (typeof val === 'object') {
          outputStr += printJSON(val, spaces + 2);

        } else if (typeof val === 'string') {
          outputStr += '"' + val + '"';

        } else {
          outputStr += val;
        }

        outputStr += ',';
      }
    }
  } else {
    var i;

    for (i = 0; i < obj.length; i += 1) {
      val = obj[i];

      if (typeof val === 'object') {
        outputStr += printJSON(val, spaces + 2);

      } else if (typeof val === 'string') {
        outputStr += '"' + val + '"';

      } else {
        outputStr += val;
      }

      if (i < (obj.length - 1)) {
        outputStr += ',';
      }
    }
  }

  outputStr += '\n\t' + makeIndentation(spaces - 2) + closing;

  return outputStr;
};


describe('RTCPeerConnection | RTCConfiguration', function() {
  this.timeout(testTimeout);

  var tc1Constraints = {
    iceServers: []
  };

  var tc2Constraints = {
    iceServers: [{
      url: 'turn:numb.viagenie.ca',
      username: 'leticia.choo@temasys.com.sg',
      credential: 'xxxxx'
    }]
  };

  var tc3Constraints = {
    iceServers: [{
      url: 'leticia.choo@temasys.com.sg@turn:numb.viagenie.ca',
      credential: 'xxxxx'
    }]
  };

  var tc4Constraints = {
    iceServers: [{
      urls: ['turn:numb.viagenie.ca', 'turn:numb.viagenie.ca'],
      username: 'leticia.choo@temasys.com.sg',
      credential: 'xxxxx'
    }]
  };

  var tc5Constraints = {
    iceServers: [{
      url: 'stun:stun.l.google.com:19302'
    }]
  };

  var tc6Constraints = {
    iceServers: [{
      url: 'turn:numb.viagenie.ca',
      username: 'leticia.choo@temasys.com.sg',
      credential: 'xxxxx'
    }, {
      url: 'stun:stun.l.google.com:19302'
    }]
  };

  var tc7Constraints = {
    bundlePolicy: 'balanced'
  };

  var tc8Constraints = {
    bundlePolicy: 'max-compat'
  };

  var tc9Constraints = {
    bundlePolicy: 'max-bundle'
  };

  var tc10Constraints = {
    iceTransportPolicy: 'none'
  };

  var tc11Constraints = {
    iceTransportPolicy: 'relay'
  };

  var tc12Constraints = {
    iceTransportPolicy: 'all'
  };

  var tc13Constraints = {
    optional: [{
      DtlsSrtpKeyAgreement: true
    }]
  };

  /* WebRTC Object should be initialized in Safari/IE Plugin */
  before(function (done) {
    this.timeout(testItemTimeout);

    if (window.webrtcDetectedBrowser !== 'IE' && window.webrtcDetectedBrowser !== 'Safari') {
      AdapterJS.onwebrtcreadyDone = true;
    }

    if (!AdapterJS.onwebrtcreadyDone) {
      AdapterJS.onwebrtcready = function () {
        done();
      };

    } else {
      done();
    }
  });


  it('new RTCPeerConnection(' + printJSON(tc1Constraints) + ')', function () {
    this.timeout(testItemTimeout);

    var peer = new RTCPeerConnection(tc1Constraints);
  });

  it('new RTCPeerConnection(' + printJSON(tc2Constraints) + ')', function () {
    this.timeout(testItemTimeout);

    var peer = new RTCPeerConnection(tc2Constraints);
  });

  it('new RTCPeerConnection(' + printJSON(tc3Constraints) + ')', function () {
    this.timeout(testItemTimeout);

    var peer = new RTCPeerConnection(tc3Constraints);
  });

  it.skip('new RTCPeerConnection(' + printJSON(tc4Constraints) + ')', function () {
    this.timeout(testItemTimeout);

    var peer = new RTCPeerConnection(tc2Constraints);
  });

  it.skip('new RTCPeerConnection(' + printJSON(tc5Constraints) + ')', function () {
    this.timeout(testItemTimeout);

    var peer = new RTCPeerConnection(tc2Constraints);
  });

  it.skip('new RTCPeerConnection(' + printJSON(tc6Constraints) + ')', function () {
    this.timeout(testItemTimeout);

    var peer = new RTCPeerConnection(tc2Constraints);
  });

  it.skip('new RTCPeerConnection(' + printJSON(tc7Constraints) + ')', function () {});

  it.skip('new RTCPeerConnection(' + printJSON(tc8Constraints) + ')', function () {});

  it.skip('new RTCPeerConnection(' + printJSON(tc9Constraints) + ')', function () {});

  it.skip('new RTCPeerConnection(' + printJSON(tc10Constraints) + ')', function () {});

  it.skip('new RTCPeerConnection(' + printJSON(tc11Constraints) + ')', function () {});

  it.skip('new RTCPeerConnection(' + printJSON(tc12Constraints) + ')', function () {});

  it('new RTCPeerConnection(' + printJSON(tc1Constraints) + ', ' + printJSON(tc13Constraints) + ')', function () {
    this.timeout(testItemTimeout);

    var peer = new RTCPeerConnection(tc1Constraints, tc10Constraints);
  });
});