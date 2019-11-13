export default {
  prefix : 'Tem',
  pluginName : 'TemWebRTCPlugin',
  pluginId : 'plugin0',
  mimetype : 'application/x-temwebrtcplugin',
  onload : '__TemWebRTCReady0',
  portalLink : 'plugin.temasys.com.sg',
  companyName: 'Temasys',
  downloadLinks : {
    mac: 'https://webrtcplugin.s3.amazonaws.com/LatestVersion/TemWebRTCPlugin.pkg',
    win: 'https://webrtcplugin.s3.amazonaws.com/LatestVersion/TemWebRTCPlugin.msi',
  },
  autoInstall: false,
  autoUpdate: true,
  refreshIEAfterInstall: false,
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
  },
  versionURL : 'https://s3-us-west-2.amazonaws.com/webrtcplugin/CURRENT_STABLE'
};
