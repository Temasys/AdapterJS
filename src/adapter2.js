'use strict';

console.log('AdapterJS');

import '@babel/polyfill';
import adapter from 'webrtc-adapter/dist/adapter_core';

// import * as config          from './config';
import * as utils                     from './utils';
import * as native_attachmediastream  from './attachmediastream';
import * as pluginManager             from './plugin/plugin_manager';
import * as getusermedia              from './plugin/getusermedia';
import * as plugin_attachmediastream  from './plugin/attachmediastream';
import * as plugin_peerConnection     from './plugin/peerconnection.js';
import * as plugin_rtpSender          from './plugin/rtpsender.js';
import * as plugin_rtpReceiver        from './plugin/rtpreceiver.js';
// import * as pluginShim      from './plugin_shim';

let browserDetails = utils.detectBrowser(window);

if ( browserDetails.browser == 'IE'
  || browserDetails.browser == 'safari-plugin' ) {
  console.log('injectPlugin');
  let pageId         = Math.random().toString(36).slice(2);
  pluginManager.init(window, pageId);
  pluginManager.injectPlugin();
  getusermedia.shimGetUserMedia(window, pluginManager);
  plugin_attachmediastream.shimAttachMediaStream(window, pluginManager, pageId);
  plugin_peerConnection.shimPeerConnection(window, pluginManager);
  plugin_rtpSender.shimRTCRtpSender(window, pluginManager);
  plugin_rtpReceiver.shimRTCRtpReceiver(window, pluginManager);
} else {
  native_attachmediastream.shimAttachMediaStream(window);
}


let AdapterJS = {
  webrtcAdapter: adapter,
  webRTCReady: pluginManager.webRTCReady
};

window.AdapterJS = AdapterJS
export default adapter;
