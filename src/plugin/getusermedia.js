'use strict';

// let window_ = null;
let pluginManager = null;

// getUserMedia constraints shim.
// Copied from Chrome
function constraintsToPlugin(c) {
  if (typeof c !== 'object' || c.mandatory || c.optional) {
    return c;
  }
  var cc = {};
  Object.keys(c).forEach(function(key) {
    if (key === 'require' || key === 'advanced') {
      return;
    }
    if (typeof c[key] === 'string') {
      cc[key] = c[key];
      return;
    }
    var r = (typeof c[key] === 'object') ? c[key] : {ideal: c[key]};
    if (r.exact !== undefined && typeof r.exact === 'number') {
      r.min = r.max = r.exact;
    }
    var oldname = function(prefix, name) {
      if (prefix) {
        return prefix + name.charAt(0).toUpperCase() + name.slice(1);
      }
      return (name === 'deviceId') ? 'sourceId' : name;
    };

    // HACK : Specially handling: if deviceId is an object with exact property,
    //          change it such that deviceId value is not in exact property
    // Reason : AJS-286 (deviceId in WebRTC samples not in the format specified as specifications)
    if ( oldname('', key) === 'sourceId' && r.exact !== undefined ) {
      r.ideal = r.exact;
      r.exact = undefined;
    }

    if (r.ideal !== undefined) {
      cc.optional = cc.optional || [];
      var oc = {};
      if (typeof r.ideal === 'number') {
        oc[oldname('min', key)] = r.ideal;
        cc.optional.push(oc);
        oc = {};
        oc[oldname('max', key)] = r.ideal;
        cc.optional.push(oc);
      } else {
        oc[oldname('', key)] = r.ideal;
        cc.optional.push(oc);
      }
    }
    if (r.exact !== undefined && typeof r.exact !== 'number') {
      cc.mandatory = cc.mandatory || {};
      cc.mandatory[oldname('', key)] = r.exact;
    } else {
      ['min', 'max'].forEach(function(mix) {
        if (r[mix] !== undefined) {
          cc.mandatory = cc.mandatory || {};
          cc.mandatory[oldname(mix, key)] = r[mix];
        }
      });
    }
  });
  if (c.advanced) {
    cc.optional = (cc.optional || []).concat(c.advanced);
  }
  return cc;
};

////////////////////////////////////////////////////////////////////////////
/// getUserMedia
////////////////////////////////////////////////////////////////////////////
function getUserMedia(constraints, successCallback, failureCallback) {
  var cc = {};
  cc.audio = constraints.audio ?
    constraintsToPlugin(constraints.audio) : false;
  cc.video = constraints.video ?
    constraintsToPlugin(constraints.video) : false;

  pluginManager.callWhenPluginReady(function() {
    pluginManager.plugin().getUserMedia(cc, successCallback, failureCallback);
  });
};

////////////////////////////////////////////////////////////////////////////
/// mediaDevices
////////////////////////////////////////////////////////////////////////////
// if (typeof Promise !== 'undefined') {
//   requestUserMedia = function(constraints) {
//     return new Promise(function(resolve, reject) {
//       try {
//         getUserMedia(constraints, resolve, reject);
//       } catch (error) {
//         reject(error);
//       }
//     });
//   };
//   if (typeof(navigator.mediaDevices) === 'undefined')
//     navigator.mediaDevices = {};
//   navigator.mediaDevices.getUserMedia = requestUserMedia;
//   navigator.mediaDevices.enumerateDevices = function() {
//     return new Promise(function(resolve) {
//       var kinds = {audio: 'audioinput', video: 'videoinput'};
//       return MediaStreamTrack.getSources(function(devices) {
//         resolve(devices.map(function(device) {
//           return {label: device.label,
//                   kind: kinds[device.kind],
//                   id: device.id,
//                   deviceId: device.id,
//                   groupId: ''};
//         }));
//       });
//     });
//   };
// }

export function shimGetUserMedia(window, pm) {
  pluginManager = pm;

  // const navigator = window && window.navigator;

  // getUserMedia error shim.
  // const origGetUserMedia = navigator.mediaDevices.getUserMedia.
  //     bind(navigator.mediaDevices);
  // navigator.mediaDevices.getUserMedia = function(c) {
  //   return origGetUserMedia(c).catch(e => Promise.reject(shimError_(e)));
  // };
  
  window.navigator.getUserMedia = getUserMedia;

  
}
