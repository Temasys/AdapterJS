'use strict';

console.log('Adapter 2');

import adapter from 'webrtc-adapter/dist/adapter_core';
window.adapter = adapter;

// import * as config          from './config';
import * as plugin          from './plugin';
// import * as pluginShim      from './plugin_shim';

plugin.injectPlugin(window);

export default adapter;
