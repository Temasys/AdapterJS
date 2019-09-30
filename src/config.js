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
