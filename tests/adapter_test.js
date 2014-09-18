var test = require('tape'),
  adapter = require('./../publish/adapter.min.js');

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

test('reattachMediaStream is defined', function (t) {
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
        if (navigator.mozGetUserMedia && window.webrtcDetectedVersion < 27) {
          if (turnCheck.url === turnUrl) {
            t.pass('Turn scenario pass (firefox 27 and below)');
          } else {
            t.fail('Turn scenario fail. Expected "' + turnUrl +
              '". Returned "' + turnCheck.url + '"');
          }
        } else {
          if (turnCheck.url === (turnUrl + turnUrlUdp)) {
            t.pass('Turn scenario pass');
          } else {
            t.fail('Turn scenario fail. Expected "' + turnUrl +
              '",. Returned "' + turnCheck.url + turnUrlUdp + '"');
            /** Check the username and password **/
          }
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
  var urls = ['turn:turn.test.com', 'turn:turn.test2.com'];
  var turnUsername = 'testUser@test.com';
  var turnPassword = 'XXXX-XXXXX';
  if (typeof window.createIceServers === 'function') {
    t.pass('Is a function');
    if (window.createIceServers.length === 3) {
      /** Check the urls and number list of array of url iceServer object **/
      /** only chrome 34 and above supports the url **/
      /** urls expects an array **/
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