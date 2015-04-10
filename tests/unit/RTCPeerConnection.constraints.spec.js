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


  if (!(obj instanceof Array)) {
    var key;

    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        outputStr += '\n\t' + makeIndentation(spaces) + '"' + key + '": ';

        var val = obj[key];

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
      var val = obj[i];

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

  var tc3Constraints = {
    iceServers: [{
      url: 'turn:numb.viagenie.ca',
      username: 'leticia.choo@temasys.com.sg',
      credential: 'xxxxx'
    }, {
      url: 'stun:stun.l.google.com:19302'
    }]
  };

  var tc4Constraints = {
    bundlePolicy: 'balanced'
  };

  var tc5Constraints = {
    bundlePolicy: 'max-compat'
  };

  var tc6Constraints = {
    bundlePolicy: 'max-bundle'
  };

  var tc7Constraints = {
    iceTransportPolicy: 'none'
  };

  var tc8Constraints = {
    iceTransportPolicy: 'relay'
  };

  var tc9Constraints = {
    iceTransportPolicy: 'all'
  };

  var tc10Constraints = {
    optional: [{
      DtlsSrtpKeyAgreement: true
    }]
  };


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

  it('new RTCPeerConnection(' + printJSON(tc4Constraints) + ')', function () {
    this.timeout(testItemTimeout);

    var peer = new RTCPeerConnection(tc4Constraints);
  });

  it('new RTCPeerConnection(' + printJSON(tc5Constraints) + ')', function () {
    this.timeout(testItemTimeout);

    var peer = new RTCPeerConnection(tc5Constraints);
  });

  it('new RTCPeerConnection(' + printJSON(tc6Constraints) + ')', function () {
    this.timeout(testItemTimeout);

    var peer = new RTCPeerConnection(tc6Constraints);
  });

  it('new RTCPeerConnection(' + printJSON(tc7Constraints) + ')', function () {
    this.timeout(testItemTimeout);

    var peer = new RTCPeerConnection(tc7Constraints);
  });

  it('new RTCPeerConnection(' + printJSON(tc8Constraints) + ')', function () {
    this.timeout(testItemTimeout);

    var peer = new RTCPeerConnection(tc8Constraints);
  });

  it('new RTCPeerConnection(' + printJSON(tc9Constraints) + ')', function () {
    this.timeout(testItemTimeout);

    var peer = new RTCPeerConnection(tc9Constraints);
  });

  it('new RTCPeerConnection(' + printJSON(tc1Constraints) + ', ' + printJSON(tc10Constraints) + ')', function () {
    this.timeout(testItemTimeout);

    var peer = new RTCPeerConnection(tc1Constraints, tc10Constraints);
  });
});