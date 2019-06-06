'use strict';

import adapter from 'webrtc-adapter/dist/adapter_core';

function bbb(a) { console.log(a); };
console.log('yolo');

window.adapter = adapter;

export default adapter;
