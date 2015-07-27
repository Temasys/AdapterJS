// Shared functions
// Checking the bytes of the canvas
var checkCanvas = function (ctx, width, height) {
  var nimg = ctx.getImageData(0, 0, width, height);

  var d = nimg.data;

  var i;

  for (i = 0; i < d.length; i += 4) {
    var r = d[i];
    var g = d[i + 1];
    var b = d[i + 2];

    if (r !== 0 || g !== 0 || b !== 0) {
      return true;
    }
  }

  return false;
};

// Drawing into a canvas using video
var drawCanvas = function (v, callback) {
  var draw = function (v,c,w,h) {
    if(v.paused || v.ended) {
      return false;
    }
    c.drawImage(v,0,0,w,h);
    setTimeout(draw,20,v,c,w,h);
  };

  var canvas = document.getElementById('test');

  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'test';
    document.body.appendChild(canvas);
  }

  var context = canvas.getContext('2d');

  var cw = Math.floor(canvas.clientWidth);
  var ch = Math.floor(canvas.clientHeight);
  canvas.width = cw;
  canvas.height = ch;

  draw(v,context,cw,ch);

 setTimeout(function () {
   v.pause();

   callback( checkCanvas(context, cw, ch) );
 }, 50);
};

// Parse the constraints of getUserMedia
var printJSON = function (obj, spaces) {
  spaces = typeof spaces !== 'number' ? 2 : spaces;

  // make indentation
  var makeIndentation = function (spaces) {
    var str = '';
    var i;

    for (i = 0; i < spaces; i += 1) {
      str += ' ';
    }

    return str;
  };

  var opening = '{';
  var closing = '}';

  if (obj instanceof Array) {
    opening = '[';
    closing = ']';
  }

  // parse object
  var outputStr = makeIndentation(spaces - 2) + opening;
  var val;


  if (!(obj instanceof Array)) {
    var key;

    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        outputStr += '\n\t' + makeIndentation(spaces) + '"' + key + '": ';

        val = obj[key];

        if (typeof val === 'object') {
          outputStr += printJSON(val, spaces + 2);

        } else if (typeof val === 'string') {
          outputStr += '"' + val + '"';

        } else {
          outputStr += val;
        }

        outputStr += ',';
      }
    }
  } else {
    var i;

    for (i = 0; i < obj.length; i += 1) {
      val = obj[i];

      if (typeof val === 'object') {
        outputStr += printJSON(val, spaces + 2);

      } else if (typeof val === 'string') {
        outputStr += '"' + val + '"';

      } else {
        outputStr += val;
      }

      if (i < (obj.length - 1)) {
        outputStr += ',';
      }
    }
  }

  outputStr += '\n\t' + makeIndentation(spaces - 2) + closing;

  return outputStr;
};

var isArrayEqual = function(array1, array2) {
  if (array1.length != array2.length) 
    return false
  
  return array1.every(function(element, index) {
    return element === array2[index]; 
  })
};

// Connect the RTCPeerConnection object
var connect = function (peer1, peer2, offerConstraints) {

  var offer = null;
  var answer = null;
  var timeout = 2000;

  // prevent defined
  if (typeof offerConstraints !== 'object' && offerConstraints !== null) {
    offerConstraints = {
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    };
  }

  // default onicecandidate function
  peer1.onicecandidate = peer1.onicecandidate || function (event) {
    var candidate = event.candidate;

    if (candidate) {
      peer2.addIceCandidate(candidate, function () { }, function (error) {
        throw error;
      });
    }
  };

  // default onicecandidate function
  peer2.onicecandidate = peer2.onicecandidate || function (event) {
    var candidate = event.candidate;

    if (candidate) {
      peer1.addIceCandidate(candidate, function () { }, function (error) {
        throw error;
      });
    }
  };

  // create offer
  var peer1OfferCb = function (o) {
    offer = o;
    peer1.setLocalDescription(offer, function() {}, function (error) {
      throw error;
    });
    peer2.setRemoteDescription(offer, function() {}, function (error) {
      throw error;
    });
    peer2.createAnswer(peer2AnswerCb, function (error) {
      throw error;
    });  
  };

  // create answer
  var peer2AnswerCb = function (a) {
    answer = a;
    peer2.setLocalDescription(answer, function() {}, function (error) {
      throw error;
    });
    peer1.setRemoteDescription(answer, function() {}, function (error) {
      throw error;
    });
  };

  // start
  peer1.createOffer(peer1OfferCb, function (error) {
    throw error;
  }, offerConstraints);
};