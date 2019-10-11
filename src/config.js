export default {
  prefix : 'Tem',
  pluginName : 'TemWebRTCPlugin',
  pluginId : 'plugin0',
  mimetype : 'application/x-temwebrtcplugin',
  onload : '__TemWebRTCReady0',
  portalLink : 'https://skylink.io/plugin/',
  companyName: 'Temasys',
  versionURL: 'https://s3-us-west-2.amazonaws.com/webrtcplugin/CURRENT_STABLE',
  downloadLinks : {
    mac: 'https://bit.ly/webrtcpluginpkg',
    win: 'https://bit.ly/webrtcpluginmsi'
  },
  refreshIEAfterInstall: true,
  TEXT: {
    PLUGIN: {
      INSTALLATION: {
        LABEL: 'This website requires you to install a WebRTC-enabling plugin to work on this browser.',
        BUTTON: 'Install Now',
      },
      UPDATE: {
        LABEL: 'A new version of your WebRTC plugin is available.',
        BUTTON: 'Update Now',
      },
      RESTART: {
        LABEL: 'Thank you. After installing the new version of your WebRTC plugin, please restart your browser to start using it.',
      },
    },
    NOT_SUPPORTED: {
      LABEL: 'Your browser does not support WebRTC.',
    },
    // REFRESH: {
    //   LABEL: 'Please refresh page',
    //   BUTTON: 'Refresh Page'
    // }
  }
};
// if(typeof AdapterJS.WebRTCPlugin.pluginInfo.downloadLinks !== "undefined" && AdapterJS.WebRTCPlugin.pluginInfo.downloadLinks !== null) {
//   if(!!navigator.platform.match(/^Mac/i)) {
//     AdapterJS.WebRTCPlugin.pluginInfo.downloadLink = AdapterJS.WebRTCPlugin.pluginInfo.downloadLinks.mac;
//   }
//   else if(!!navigator.platform.match(/^Win/i)) {
//     AdapterJS.WebRTCPlugin.pluginInfo.downloadLink = AdapterJS.WebRTCPlugin.pluginInfo.downloadLinks.win;
//   }
// }
