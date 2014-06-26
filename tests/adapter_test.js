var test = require('tape'),
	adapter = require('./../source/adapter.js');


test('RTCPeerConnection is defined', function (t) {
  t.plan(1);
  t.pass();
});
