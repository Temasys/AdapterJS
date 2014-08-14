var test = require('tape'),
	adapter = require('./../publish/adapter.min.js');


test('RTCPeerConnection is defined', function (t) {
  t.plan(1);
  t.notEqual(window.RTCPeerConnection, undefined);
});

test('getUserMedia is defined', function (t) {
  t.plan(1);
  t.notEqual(window.getUserMedia, undefined);
});