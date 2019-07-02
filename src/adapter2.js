'use strict';

console.log('AdapterJS');

import adapter from 'webrtc-adapter/dist/adapter_core';

// import * as config          from './config';
import * as pluginManager          from './plugin_manager';
import * as getusermedia    from './plugin/getusermedia';
// import * as pluginShim      from './plugin_shim';

console.log('injectPlugin');
pluginManager.injectPlugin(window);
getusermedia.shimGetUserMedia(window, pluginManager);

let AdapterJS = {
  webrtcAdapter: adapter,
  webRTCReady: pluginManager.webRTCReady
};

window.AdapterJS = AdapterJS
export default adapter;
