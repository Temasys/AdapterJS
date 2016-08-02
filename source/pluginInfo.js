AdapterJS.WebRTCPlugin.pluginInfo = AdapterJS.WebRTCPlugin.pluginInfo || {
  prefix : 'Tem',
  plugName : 'TemWebRTCPlugin',
  pluginId : 'plugin0',
  type : 'application/x-temwebrtcplugin',
  onload : '__TemWebRTCReady0',
  portalLink : 'http://skylink.io/plugin/',
  downloadLink : null, //set below
  companyName: 'Temasys',
  downloadLinks : {
    mac: 'http://bit.ly/1n77hco',
    win: 'http://bit.ly/1kkS4FN'
  }
};
if(!!navigator.platform.match(/^Mac/i)) {
  AdapterJS.WebRTCPlugin.pluginInfo.downloadLink = AdapterJS.WebRTCPlugin.pluginInfo.downloadLinks.mac || 'http://bit.ly/1n77hco';
}
else if(!!navigator.platform.match(/^Win/i)) {
  AdapterJS.WebRTCPlugin.pluginInfo.downloadLink = AdapterJS.WebRTCPlugin.pluginInfo.downloadLinks.win || 'http://bit.ly/1kkS4FN';
}
