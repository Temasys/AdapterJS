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

/*
iceRestart of type boolean, defaulting to false
When the value of this dictionary member is true, the generated description will have ICE credentials that are different from the current credentials (as visible in the localDescription attribute's SDP). Applying the generated description will restart ICE.

When the value of this dictionary member is false, and the localDescription attribute has valid ICE credentials, the generated description will have the same ICE credentials as the current value from the localDescription attribute.

offerToReceiveAudio of type long
In some cases, an RTCPeerConnection may wish to receive audio but not send any audio. The RTCPeerConnection needs to know if it should signal to the remote side whether it wishes to receive audio. This option allows an application to indicate its preferences for the number of audio streams to receive when creating an offer.

offerToReceiveVideo of type long
In some cases, an RTCPeerConnection may wish to receive video but not send any video. The RTCPeerConnection needs to know if it should signal to the remote side whether it wishes to receive video or not. This option allows an application to indicate its preferences for the number of video streams to receive when creating an offer.

voiceActivityDetection of type boolean, defaulting to true
*/


describe('RTCPeerConnection.createOffer | RTCOfferOptions', function() {
  this.timeout(testTimeout);

  var peer1 = null;
  var peer2 = null;

  var tc1Constraints = {
    iceRestart: true
  };

  var tc2Constraints = {
    voiceActivityDetection: true
  };

  var tc3Constraints = {
    offerToReceiveVideo: true,
    offerToReceiveAudio: false
  };

  var tc4Constraints = {
    offerToReceiveVideo: true
  };

  var tc5Constraints = {
    offerToReceiveVideo: false,
    offerToReceiveAudio: true
  };

  var tc6Constraints = {
    offerToReceiveAudio: false
  };

  var tc7Constraints = {
    offerToReceiveVideo: true,
    offerToReceiveAudio: true
  };

  var tc8Constraints = {
    offerToReceiveVideo: false,
    offerToReceiveAudio: false
  };

  var tc9Constraints = {};

  /* Create peer objects */
  beforeEach(function (done) {
    peer1 = new RTCPeerConnection({
      iceServers: []
    });

    peer2 = new RTCPeerConnection({
      iceServers: []
    });
  });


  it('new RTCPeerConnection(' + printJSON(tc1Constraints) + ')', function () {
    this.timeout(testItemTimeout);

    


  });
});