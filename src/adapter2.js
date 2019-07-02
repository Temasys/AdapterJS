'use strict';

console.log('AdapterJS');

import adapter from 'webrtc-adapter/dist/adapter_core';

// import * as config          from './config';
import * as plugin          from './plugin';
// import * as pluginShim      from './plugin_shim';

console.log('injectPlugin');
plugin.injectPlugin(window);

let AdapterJS = {
  webrtcAdapter: adapter,
  webRTCReady: plugin.webRTCReady
};

window.AdapterJS = AdapterJS
export default adapter;
