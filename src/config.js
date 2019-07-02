export default {
  prefix : 'Tem',
  plugName : 'TemWebRTCPlugin',
  pluginId : 'plugin0',
  type : 'application/x-temwebrtcplugin',
  onload : '__TemWebRTCReady0',
  portalLink : 'https://skylink.io/plugin/',
  companyName: 'Temasys',
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
