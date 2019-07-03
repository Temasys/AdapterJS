'use strict';

console.log('AdapterJS');

import '@babel/polyfill';
import adapter from 'webrtc-adapter/dist/adapter_core';

// import * as config          from './config';
import * as pluginManager       from './plugin_manager';
import * as getusermedia        from './plugin/getusermedia';
import * as attachmediastream   from './attachmediastream';
// import * as pluginShim      from './plugin_shim';

let pageId = Math.random().toString(36).slice(2);

console.log('injectPlugin');
pluginManager.init(window, pageId);
pluginManager.injectPlugin();
getusermedia.shimGetUserMedia(window, pluginManager);
attachmediastream.shimAttachMediaStream(window, pluginManager, pageId);

let AdapterJS = {
  webrtcAdapter: adapter,
  webRTCReady: pluginManager.webRTCReady
};

window.AdapterJS = AdapterJS
export default adapter;
