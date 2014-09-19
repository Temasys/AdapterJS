var test = require('tape'),
  adapter = require('./../source/adapter.js');

test('RTCPeerConnection', function (t) {
  t.plan(12);
  var pc = new window.RTCPeerConnection();

  if (pc.iceConnectionState === 'new') {
    t.pass('iceConnectionState equals "new"');
  } else {
    t.fail('iceConnectionState equals "' + pc.iceConnectionState +
      '". Expected "new"');
  }
  if (pc.iceGatheringState === 'new') {
    t.pass('iceGatheringState equals "new"');
  } else {
    t.fail('iceGatheringState equals "' + pc.iceGatheringState +
      '". Expected "new"');
  }
  if (pc.signalingState === 'stable') {
    t.pass('signalingState equals "stable"');
  } else {
    t.fail('signalingState equals "' + pc.signalingState +
      '". Expected "stable"');
  }
  if (pc.hasOwnProperty('localDescription')) {
    t.pass('Has localDescription');
  } else {
    t.fail('Does not have localDescription');
  }
  if (pc.hasOwnProperty('remoteDescription')) {
    t.pass('Has remoteDescription');
  } else {
    t.fail('Does not have remoteDescription');
  }
  if (pc.hasOwnProperty('onaddstream')) {
    t.pass('Has onaddstream');
  } else {
    t.fail('Does not have onaddstream');
  }
  if (pc.hasOwnProperty('ondatachannel')) {
    t.pass('Has ondatachannel');
  } else {
    t.fail('Does not have ondatachannel');
  }
  if (pc.hasOwnProperty('onicecandidate')) {
    t.pass('Has onicecandidate');
  } else {
    t.fail('Does not have onicecandidate');
  }
  if (pc.hasOwnProperty('oniceconnectionstatechange')) {
    t.pass('Has oniceconnectionstatechange');
  } else {
    t.fail('Has oniceconnectionstatechange');
  }
  if (pc.hasOwnProperty('onnegotiationneeded')) {
    t.pass('Has onnegotiationneeded');
  } else {
    t.fail('Does not have onnegotiationneeded');
  }
  if (pc.hasOwnProperty('onremovestream')) {
    t.pass('Has onremovestream');
  } else {
    t.fail('Does not have onremovestream');
  }
  if (pc.hasOwnProperty('onsignalingstatechange')) {
    t.pass('Has onsignalingstatechange');
  } else {
    t.fail('Does not have onsignalingstatechange');
  }
});

test('RTCSessionDescription', function (t) {
  t.plan(2);
  var sdp = new window.RTCSessionDescription();

  if (sdp.hasOwnProperty('sdp')) {
    t.pass('Has sdp');
  } else {
    t.fail('Does not have sdp');
  }
  // Test 2: iceGatheringState
  if (sdp.hasOwnProperty('type')) {
    t.pass('Has type');
  } else {
    t.fail('Does not have type');
  }
});

test('RTCIceCandidate', function (t) {
  t.plan(3);
  var candidateConfig = {
    candidate: 'iceCandidateItem',
    sdpMid: 'sdpMidItem',
    sdpMLineIndex: 1
  };
  var candidate = new RTCIceCandidate(candidateConfig);

  console.log('Config passed: ' + JSON.stringify(candidateConfig));

  if (candidate.candidate === 'iceCandidateItem') {
    t.pass('candidate equals "iceCandidateItem"');
  } else {
    t.fail('candidate equals "' + candidate.candidate +
      '". Expected "iceCandidateItem"');
  }
  if (candidate.sdpMid === 'sdpMidItem') {
    t.pass('sdpMid equals "sdpMidItem"');
  } else {
    t.fail('sdpMid equals "' + candidate.sdpMid +
      '". Expected "sdpMidItem"');
  }
  if (candidate.sdpMLineIndex === 1) {
    t.pass('sdpMLineIndex equals 1');
  } else {
    t.fail('sdpMLineIndex equals ' + candidate.sdpMLineIndex +
      '. Expected 1');
  }
});

test('MediaStreamTrack.getSources()', function (t) {
  t.plan(3);
  if (typeof window.MediaStreamTrack.getSources === 'function') {
    t.pass('Is a function');
    if (window.MediaStreamTrack.getSources.length === 1) {
      t.pass('Expects 1 argument');
      window.MediaStreamTrack.getSources(function (sources) {
        if (sources instanceof Array) {
          t.pass('Received array object');
        } else {
          t.fail('Received ' + (typeof sources) +
            ' that is not an instance of array object');
        }
      });
    } else {
      t.fail('Expects 1 argument. Returned ' +
        window.MediaStreamTrack.getSources.length);
    }
  } else {
    t.fail('Is a ' + (typeof window.MediaStreamTrack.getSources) +
      '. Expected a function');
  }
});

test('getUserMedia()', function (t) {
  t.plan(2);
  if (typeof window.getUserMedia === 'function') {
    t.pass('Is a function');
    if (window.getUserMedia.length === 3) {
      t.pass('Expects 3 arguments');
    } else {
      t.fail('Expects 3 arguments. Returned ' + window.getUserMedia.length);
    }
  } else {
    t.fail('Is a ' + (typeof window.getUserMedia) +
      '. Expected a function');
    t.fail('Unable to execute function parameter check');
  }
});

test('attachMediaStream()', function (t) {
  t.plan(3);
  var fakeStream = new Blob(['<a href="#"></a>'], { type: 'text/html' });

  if (typeof window.attachMediaStream === 'function') {
    t.pass('Is a function');
    if (window.attachMediaStream.length === 2) {
      t.pass('Expects 2 arguments');
      var video = document.createElement('video');
      video.id = 'attachMediaStreamTest';
      video.style.display = 'none';
      document.body.appendChild(video);
      window.attachMediaStream(video, fakeStream);
      if (video.src.indexOf('blob:') > -1) {
        t.pass('Source url is a blob');
      } else {
        t.fail('Source url is not a blob');
      }
    } else {
      t.fail('Expects 2 arguments. Returned ' + window.attachMediaStream.length);
    }
  } else {
    t.fail('Is a ' + (typeof window.attachMediaStream) +
      '. Expected a function');
    t.fail('Unable to execute function parameter check');
    t.fail('Unable to execute function video source check');
  }
});

test('reattachMediaStream()', function (t) {
  t.plan(3);
  if (typeof window.reattachMediaStream === 'function') {
    t.pass('Is a function');
    if (window.reattachMediaStream.length === 2) {
      t.pass('Expects 2 arguments');
      var video = document.getElementById('attachMediaStreamTest');
      var reVideo = document.createElement('reVideo');
      reVideo.style.display = 'none';
      document.body.appendChild(reVideo);
      window.reattachMediaStream(reVideo, video);
      if (reVideo.src === video.src) {
        t.pass('Source url is the same');
      } else {
        t.fail('Source url is not the same. Expected source: "' +
          video.src + '". Returned: "' + reVideo.src + '"');
      }
    } else {
      t.fail('Expects 2 arguments. Returned ' + window.reattachMediaStream.length);
    }
  } else {
    t.fail('Is a ' + (typeof window.reattachMediaStream) +
      '. Expected a function');
    t.fail('Unable to execute function parameter check');
    t.fail('Unable to execute function video source check');
  }
});

test('createIceServer()', function (t) {
  t.plan(4);
  var stunUrl = 'stun:stun.l.example.com:19302';
  var turnUrl = 'turn:turn.test.com';
  var turnUrlUdp = '?transport=udp';
  var turnUsername = 'testUser@test.com';
  var turnPassword = 'XXXX-XXXXX';
  if (typeof window.createIceServer === 'function') {
    t.pass('Is a function');
    if (window.createIceServer.length === 3) {
      t.pass('Expects 3 arguments');
      var stunCheck = window.createIceServer(stunUrl);
      if ((Object.keys(stunCheck).length === 1 || (Object.keys(stunCheck).length === 2 &&
        stunCheck.hasCredentials === false)) && stunCheck.url === stunUrl) {
        t.pass('Stun scenario pass');
      } else {
        t.fail('Stun scenario fail. Expected 1 key and value to be: "' +
          stunUrl + '". Returned ' + Object.keys(stunCheck) + ' and "' +
          stunCheck.url + '"');
      }
      var turnCheck = window.createIceServer(turnUrl + turnUrlUdp, turnUsername, turnPassword);
      if ((Object.keys(turnCheck).length === 3 || (Object.keys(stunCheck).length === 4 &&
        stunCheck.hasCredentials === true))) {
        var isNoSupportFirefox = navigator.mozGetUserMedia && window.webrtcDetectedVersion < 27;
        turnUrlCheck = turnUrl + ((!isNoSupportFirefox) ? turnUrlUdp : '');

        if (turnCheck.url === turnUrlCheck && turnCheck.username === turnUsername &&
          turnCheck.credential === turnPassword) {
          t.pass('Turn scenario pass' + ((isNoSupportFirefox) ? ' (firefox 27 and below)': ''));
        } else {
          t.fail('Turn scenario fail. Expected "' + turnUrl + '", "' + turnUsername + '" and "' +
            turnPassword + '". Returned "' + turnCheck.url + '", "' +
            turnCheck.username + '" and "' + turnCheck.credential + '"');
        }
      } else {
        t.fail('Turn scenario fail. Expected 1 key. Returned ' + Object.keys(stunCheck));
      }
    } else {
      t.fail('Expects 3 arguments. Returned ' + window.createIceServer.length);
    }
  } else {
    t.fail('Is a ' + (typeof window.attachMediaStream) +
      '. Expected a function');
    t.fail('Unable to execute function parameter check');
    t.fail('Unable to execute function stun server check');
    t.fail('Unable to execute function turn server check');
  }
});

test('createIceServers()', function (t) {
  t.plan(3);
  var urls = ['turn:turn.test.com', 'stun:turn.test2.com'];
  var username = 'testUser@test.com';
  var password = 'XXXX-XXXXX';
  if (typeof window.createIceServers === 'function') {
    t.pass('Is a function');
    if (window.createIceServers.length === 3) {
      t.pass('Expects 3 arguments');
      var iceServers = window.createIceServers(urls, username, password);
      if (iceServers instanceof Array) {
        var passed = 0;
        for (var i = 0; i < iceServers.length; i++) {
          if (iceServers[i].url === urls[i] && iceServers[i].username === username &&
            iceServers[i].credential === password) {
            passed++;
          } else {
            t.fail('Ice server at ' + i + ' provided is incorrect. Expected "' + urls[i] +
              '", "' + username + '" and "' + password + '". Returned "' + iceServers[i].url +
              '", "' + iceServers[i].username + '" and "' + iceServers[i].credential + '"');
            break;
          }
        }
        if (passed === iceServers.length) {
          t.pass('Ice servers are correct');
        }
      } else if (window.webrtcDetectedBrowser === 'chrome' && window.webrtcDetectedVersion >= 34 &&
          typeof iceServers === 'object') { // Supports urls attribute
        if (typeof iceServers === 'object') {
          if (iceServers.urls === urls && iceServers.username === username &&
            iceServers.credential === password) {
            t.pass('Ice servers are correct. Test for (chrome 34 and above)');
          }
        } else {
          t.fail('Ice servers are incorrect. Test for (chrome 34 and above). Expected [' +
            urls.toString() + '], "' + username + '" and "' + password + '". Returned [' +
            iceServers.urls.toString() + '], "' + iceServers.username + '" and "' +
            iceServers.credential + '"');
        }
      } else {
        t.fail('Parsed in a different typeof object. Expected an Array ' +
          'or object (chrome 34 and above). Returned ' + (typeof iceServers));
      }
    } else {
      t.fail('Expects 3 arguments. Returns ' + window.createIceServers.length);
    }
  } else {
    t.fail('Is a ' + (typeof window.createIceServers) +
      '. Expected a function');
    t.fail('Unable to execute function parameter check');
    t.fail('Unable to execute function ice servers check');
  }
});

test('webrtcDetectedBrowser', function (t) {
  t.plan(2);
  var test_array = ['chrome', 'firefox', 'safari', 'IE', 'opera'];
  if (typeof window.webrtcDetectedBrowser === 'string') {
    t.pass('Is a string');
    if (test_array.indexOf(window.webrtcDetectedBrowser) > -1) {
      t.pass('Is one of the supported browser "' +
        window.webrtcDetectedBrowser + '"');
    } else {
      t.fail('Is not supported browser. Type given was "' +
        window.webrtcDetectedBrowser + '"');
    }
  } else {
    t.fail('Is a ' + (typeof window.webrtcDetectedBrowser) +
      '. Expected a string');
  }
});

test('webrtcDetectedVersion', function (t) {
  t.plan(1);
  if (typeof window.webrtcDetectedVersion === 'number') {
    t.pass('Is a number');
  } else {
    t.fail('Is a ' + (typeof window.webrtcDetectedVersion) +
      '. Expected a number');
  }
});

test('webrtcDetectedType', function (t) {
  t.plan(2);
  var test_array = ['moz', 'webkit', 'plugin'];
  if (typeof window.webrtcDetectedType === 'string') {
    t.pass('Is a string');
    if (test_array.indexOf(window.webrtcDetectedType) > -1) {
      t.pass('Is one of the support type "' +
        window.webrtcDetectedType + '"');
    } else {
      t.fail('Is not supported type. Type given was "' +
        window.webrtcDetectedType + '"');
    }
  } else {
    t.fail('Is a ' + (typeof window.webrtcDetectedType) +
      '. Expected a string');
  }
});

test('webrtcDetectedDCSupport', function (t) {
  t.plan(2);
  var test_array = ['SCTP', 'RTP'];
  if (typeof window.webrtcDetectedDCSupport === 'string') {
    t.pass('Is a string');
    if (test_array.indexOf(window.webrtcDetectedDCSupport) > -1) {
      t.pass('Is one of the support type "' +
        window.webrtcDetectedDCSupport + '"');
    } else {
      t.fail('Is not supported type. Type given was "' +
        window.webrtcDetectedDCSupport + '"');
    }
  } else {
    t.fail('Is a ' + (typeof window.webrtcDetectedDCSupport) +
      '. Expected a string');
  }
});

test('checkMediaDataChannelSettings()', function (t) {
  t.plan(38);
  var originalBrowser = window.webrtcDetectedBrowser;
  var originalVersion = window.webrtcDetectedVersion;
  var originalType = window.webrtcDetectedType;
  var browsers = ['chrome|35|webkit', 'firefox|27|moz', 'firefox|32|moz',
    'opera|22|webkit', 'safari|6|plugin', 'IE|11|plugin'];
  if (typeof window.checkMediaDataChannelSettings === 'function') {
    t.pass('Is a function');
    if (window.checkMediaDataChannelSettings.length === 4) {
      t.pass('Expects 4 arguments');
      for (var i = 0; i < browsers.length; i++) {
        window.webrtcDetectedBrowser = browsers[i].split('|')[0];
        window.webrtcDetectedVersion = parseInt(browsers[i].split('|')[1], 10);
        window.webrtcDetectedType = browsers[i].split('|')[2];
        for (var j = 0; j < browsers.length; j++) {
          var peerBrowser = browsers[j].split('|')[0];
          var peerVersion = parseInt(browsers[j].split('|')[1], 10);
          /* jshint -W083 */
          window.checkMediaDataChannelSettings(peerBrowser, peerVersion,
            function (beOfferer, constraints) {
            if (window.webrtcDetectedType === 'moz' &&
              window.webrtcDetectedVersion < 30 && (peerBrowser !== 'firefox')) {
              if (beOfferer === false &&
                constraints.mandatory.MozDontOfferDataChannel === true) {
                t.pass(window.webrtcDetectedBrowser + ' ' +
                  window.webrtcDetectedVersion + ' to ' +
                  peerBrowser + ' ' + peerVersion);
              } else {
                t.fail(window.webrtcDetectedBrowser + ' ' +
                  window.webrtcDetectedVersion + ' to ' + peerBrowser + ' ' +
                  peerVersion + ' - Failed. Expected beOfferer ' +
                  'false and constraints.mandatory.MozDontOfferDataChannel true. ' +
                  'Received beOfferer ' + beOfferer + ' and constraints.mandatory.' +
                  'MozDontOfferDataChannel ' +
                  constraints.mandatory.MozDontOfferDataChannel);
              }
            } else if (window.webrtcDetectedType === 'moz' &&
              peerBrowser === 'firefox') {
              if (beOfferer === true &&
                !constraints.mandatory.hasOwnProperty('MozDontOfferDataChannel')) {
                t.pass(window.webrtcDetectedBrowser + ' ' +
                  window.webrtcDetectedVersion + ' to ' +
                  peerBrowser + ' ' + peerVersion);
              } else {
                t.fail(window.webrtcDetectedBrowser + ' ' +
                  window.webrtcDetectedVersion + ' to ' +
                  peerBrowser + ' ' + peerVersion + ' - Failed. ' +
                  'Expected beOfferer true and constraints.mandatory has ' +
                  'property MozDontOfferDataChannel false. ' +
                  'Received beOfferer ' + beOfferer + ' and ' +
                  'constraints.mandatory has property MozDontOfferDataChannel ' +
                  constraints.mandatory.hasOwnProperty('MozDontOfferDataChannel'));
              }
            } else {
              if (beOfferer === true &&
                !constraints.mandatory.hasOwnProperty('MozDontOfferDatachannel')) {
                t.pass(window.webrtcDetectedBrowser + ' ' +
                  window.webrtcDetectedVersion + ' to ' +
                  peerBrowser + ' ' + peerVersion);
              } else {
                t.fail(window.webrtcDetectedBrowser + ' ' +
                  window.webrtcDetectedVersion + ' to ' + peerBrowser + ' ' +
                  peerVersion + ' - Failed. Expected beOfferer true and ' +
                  'constraints.mandatory has property MozDontOfferDataChannel false. ' +
                  'Received beOfferer ' + beOfferer + ' and constraints.mandatory ' +
                  'has property MozDontOfferDataChannel ' +
                  constraints.mandatory.hasOwnProperty('MozDontOfferDataChannel'));
              }
              /** maybe check if constraints contains Moz properties? **/
              /** for chrome don't contain moz properties **/
              /** for nightly contain moz properties but not MozDontOfferDatachannel **/
            }
          }, {
            optional: [],
            mandatory: {
              MozDontOfferDataChannel: true
          }});
          /* jshint +W083 */
        }
        window.webrtcDetectedBrowser = originalBrowser;
        window.webrtcDetectedVersion = originalVersion;
        window.webrtcDetectedType = originalType;
      }
    } else {
      t.fail('Expects 4 arguments. Returned ' +
        window.checkMediaDataChannelSettings.length);
    }
  } else {
    t.fail('Is a ' + (typeof window.attachMediaStream) +
      '. Expected a function');
    t.fail('Unable to execute function parameter check');
    t.fail('Failed to execute scenarios test');
    t.end();
  }
});

test('checkIceConnectionState()', function (t) {
  t.plan(6);
  var expected = ['checking', 'connected', 'completed'];
  var scenario1 = ['checking', 'completed', 'completed'];
  var scenario2 = ['checking', 'completed'];
  var scenario3 = ['checking', 'connected', 'completed'];
  var scenario4 = ['checking', 'connected'];
  var checkICS = function (scenario, id) {
    var checkArray = [];
    /* jshint -W083 */
    for (var i = 0; i < scenario.length; i++) {
      window.checkIceConnectionState(id, scenario[i], function (icState) {
        checkArray.push(icState);
      });
    }
    /* jshint +W083 */
    setTimeout(function () {
      t.deepEqual(checkArray, expected, 'Scenario [' + scenario.toString() + ']');
    }, 1000);
  };
  if (typeof window.createIceServers === 'function') {
    t.pass('Is a function');
    if (window.createIceServers.length === 3) {
      t.pass('Expects 3 arguments');
      checkICS(scenario1, 1);
      checkICS(scenario2, 2);
      checkICS(scenario3, 3);
      checkICS(scenario4, 4);
    } else {
      t.fail('Expects 3 arguments. Returns ' + window.createIceServers.length);
    }
  } else {
    t.fail('Is a ' + (typeof window.createIceServers) +
      '. Expected a function');
    t.fail('Unable to execute function parameter check');
    t.fail('Unable to execute function ice connection state check for scenario 1');
    t.fail('Unable to execute function ice connection state check for scenario 2');
    t.fail('Unable to execute function ice connection state check for scenario 3');
    t.fail('Unable to execute function ice connection state check for scenario 4');
  }
});