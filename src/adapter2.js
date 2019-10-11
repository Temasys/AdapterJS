'use strict';

console.log('AdapterJS');

import '@babel/polyfill';
import adapter from 'webrtc-adapter/dist/adapter_core';

import * as utils                     from './utils';
import * as native_attachmediastream  from './attachmediastream';
import * as plugin_manager            from './plugin/plugin_manager';
import * as plugin_getusermedia       from './plugin/getusermedia';
import * as plugin_attachmediastream  from './plugin/attachmediastream';
import * as plugin_peerConnection     from './plugin/peerconnection.js';
import * as plugin_rtpSender          from './plugin/rtpsender.js';
import * as plugin_rtpReceiver        from './plugin/rtpreceiver.js';
import * as plugin_rtpTransceiver     from './plugin/rtptransceiver.js';
// import * as pluginShim      from './plugin_shim';

let browserDetails = utils.detectBrowser(window);

if ( browserDetails.browser == 'IE'
  || browserDetails.browser == 'safari-plugin' ) {
  console.log('Using Temasys Plugin');

  let pageId = Math.random().toString(36).slice(2);
  plugin_manager.init(window, pageId);

  // Note : Shims don't need the plugin to be injected before being defined
  plugin_getusermedia.shimGetUserMedia(window, plugin_manager);
  plugin_attachmediastream.shimAttachMediaStream(window, plugin_manager, pageId);
  plugin_peerConnection.shimPeerConnection(window, plugin_manager);
  plugin_rtpSender.shimRTCRtpSender(window, plugin_manager);
  plugin_rtpReceiver.shimRTCRtpReceiver(window, plugin_manager);
  plugin_rtpTransceiver.shimRTCRtpTransceiver(window, plugin_manager);

  if (!plugin_manager.isPluginInstalled()) 
    plugin_manager.installPlugin();
  else {
    plugin_manager.injectPlugin();
    if (plugin_manager.isUpdateAvailable())
      plugin_manager.updatePlugin();
  }
} 
else {
  native_attachmediastream.shimAttachMediaStream(window);
}

let AdapterJS = {
  webrtcAdapter: adapter,
  webRTCReady: plugin_manager.webRTCReady,
  pluginManager: plugin_manager,
  utils: utils,
};

window.AdapterJS = AdapterJS
export default AdapterJS;
