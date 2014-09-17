var test = require('tape'),
  adapter = require('./../publish/adapter.min.js');

// Check if function is defined
test('RTCPeerConnection is defined', function (t) {
  t.plan(1);
  t.equal(typeof window.RTCPeerConnection, 'function');
});

test('RTCSessionDescription is defined', function (t) {
  t.plan(1);
  t.equal(typeof window.RTCSessionDescription, 'function');
});

test('RTCIceCandidate is defined', function (t) {
  t.plan(1);
  t.equal(typeof window.RTCIceCandidate, 'function');
});

test('getUserMedia is defined', function (t) {
  t.plan(1);
  t.equal(typeof window.getUserMedia, 'function');
});

test('attachMediaStream is defined', function (t) {
  t.plan(1);
  t.equal(typeof window.attachMediaStream, 'function');
});

test('reattachMediaStream is defined', function (t) {
  t.plan(1);
  t.equal(typeof window.reattachMediaStream, 'function');
});

test('MediaStreamTrack.getSources', function (t) {
  t.plan(1);
  window.MediaStreamTrack.getSources(function (sources) {
    if (sources instanceof Array) {
      t.pass();
    }
  });
});