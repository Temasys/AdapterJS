// Polyfill all MediaStream objects
var polyfillRTCPeerConnection = null;

// Return the event payload
var returnEventPayloadFn = function (stream) {
	return {
  	bubbles: false,
  	cancelBubble: false,
  	cancelable: false,
  	currentTarget: stream,
  	defaultPrevented: false,
  	eventPhase: 0,
  	returnValue: true,
  	srcElement: stream,
  	target: stream,
  	timeStamp: stream.currentTime || (new Date()).getTime()
  };
};

// MediaStreamTracks Polyfilled
var storePolyfillMediaStreamTracks = {};

// Firefox MediaStream
if (navigator.mozGetUserMedia) {

	/**
	 * The polyfilled RTCPeerConnection class.
	 * @class RTCPeerConnection
	 * @since 0.10.5
	 */
	polyfillRTCPeerConnection = function (stream) {

		/**
		 * The MediaStream object id.
		 * @attribute id
		 * @type String
		 * @readOnly
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream.id = stream.id || (new Date()).getTime().toString();

		/**
		 * The flag that indicates if a MediaStream object has ended.
		 * @attribute ended
		 * @type Boolean
		 * @readOnly
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream.ended = false;

		/**
		 * Event triggered when MediaStream has ended streaming.
		 * @event onended
		 * @param {String} type The type of event: <code>"ended"</code>.
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream.onended = null;

		/**
		 * Event triggered when MediaStream has added a new track.
		 * @event onaddtrack
		 * @param {String} type The type of event: <code>"addtrack"</code>.
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream.onaddtrack = null;

		/**
		 * Event triggered when MediaStream has removed an existing track.
		 * @event onremovetrack
		 * @param {String} type The type of event: <code>"removetrack"</code>.
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream.onremovetrack = null;

		/**
		 * Event triggered when a feature in the MediaStream is not supported
		 *   but used.
		 * @event onunsupported
		 * @param {String} feature The feature that is not supported. <i>Eg. <code>"addTrack"</code></i>.
		 * @param {Object} error The error received natively.
		 * @param {String} type The type of event: <code>"unsupported"</code>.
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream.onunsupported = null;


		(function () {
			var i, j;

			var audioTracks = stream.getAudioTracks();
	    var videoTracks = stream.getVideoTracks();

	    // Check for all tracks if ended
	    for (i = 0; i < audioTracks.length; i += 1) {
	      polyfillMediaStreamTrack( audioTracks[i] );
	    }

	    for (j = 0; j < videoTracks.length; j += 1) {
	      polyfillMediaStreamTrack( videoTracks[j] );
	    }
		})();

		/**
		 * Stops a MediaStream streaming.
		 * @method polystop
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream.polystop = function () {
			if (stream instanceof LocalMediaStream) {
				stream.stop();

			} else {
				var i, j;

				var audioTracks = stream.getAudioTracks();
				var videoTracks = stream.getVideoTracks();

				for (i = 0; i < audioTracks.length; i += 1) {
					audioTracks[i].polystop();
				}

				for (j = 0; j < videoTracks.length; j += 1) {
					videoTracks[j].polystop();
				}
			}
		};

		/**
		 * Adds a MediaStreamTrack to an object.
		 * @method polyaddTrack
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream.polyaddTrack = function (track) {
			try {
				stream.addTrack(track);
			} catch (error) {
				// trigger that it has ended
        if (typeof stream.onunsupported === 'function') {
          var eventPayload = returnEventPayloadFn(stream);
          eventPayload.type = 'unsupported';
          eventPayload.error = error;
          eventPayload.feature = 'addTrack';
          stream.onunsupported(eventPayload);
        }
			}
		};

		/**
		 * Gets a MediaStreamTrack from a MediaStreamTrack based on the object id provided.
		 * @method polygetTrackById
		 * @param {String} trackId The MediaStreamTrack object id.
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream.polygetTrackById = function (trackId) {
			var i, j;

			var audioTracks = stream.getAudioTracks();
	    var videoTracks = stream.getVideoTracks();

	    // Check for all tracks if ended
	    for (i = 0; i < audioTracks.length; i += 1) {
	      if (audioTracks[i].id === trackId) {
	      	return audioTracks[i];
	      }
	    }

	    for (j = 0; j < videoTracks.length; j += 1) {
	      if (videoTracks[i].id === trackId) {
	      	return videoTracks[i];
	      }
	    }

	    return null;
		};

		/**
		 * Removes a MediaStreamTrack from an object.
		 * @method polyremoveTrack
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream.polyremoveTrack = function (track) {
			try {
				stream.removeTrack(track);
			} catch (error) {
				// trigger that it has ended
        if (typeof stream.onunsupported === 'function') {
          var eventPayload = returnEventPayloadFn(stream);
          eventPayload.type = 'unsupported';
          eventPayload.error = error;
          eventPayload.feature = 'removeTrack';
          stream.onunsupported(eventPayload);
        }
			}
		};

		/**
		 * Gets the list of audio MediaStreamTracks of a MediaStream.
		 * @method polygetAudioTracks
		 * @return {Array} Returns a list of the audio MediaStreamTracks
		 *   available for the MediaStream.
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream.polygetAudioTracks = stream.getAudioTracks;

		/**
		 * Gets the list of video MediaStreamTracks of a MediaStream.
		 * @method polygetVideoTracks
		 * @return {Array} Returns a list of the video MediaStreamTracks
		 *   available for the MediaStream.
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream.polygetVideoTracks = stream.getVideoTracks;

		/**
		 * Listens and waits to check if all MediaStreamTracks of a MediaStream
		 *   has ended. Once ended, this invokes the ended flag of the MediaStream.
		 * This loops every second.
		 * @method _polyOnTracksEndedListener
		 * @private
		 * @optional
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream._polyOnTracksEndedListener = setInterval(function () {
	    var i, j;

	    var audios = stream.getAudioTracks();
	    var videos = stream.getVideoTracks();

	    var audioEnded = true;
	    var videoEnded = true;

	    // Check for all tracks if ended
	    for (i = 0; i < audios.length; i += 1) {
	      if (audios[i].ended !== true) {
	        audioEnded = false;
	        break;
	      }
	    }

	    for (j = 0; j < videos.length; j += 1) {
	      if (videos[j].ended !== true) {
	        videoEnded = false;
	        break;
	      }
	    }

	    if (audioEnded && videoEnded) {
	      clearInterval(stream._polyOnTracksEndedListener);
	      stream.ended = true;
	    }
	  }, 1000);

	  /**
		 * Listens and waits to check if all MediaStream has ended.
		 * This loops every second.
		 * @method _polyOnEndedListener
		 * @private
		 * @optional
		 * @for MediaStream
		 * @since 0.10.6
		 */
		if (stream instanceof LocalMediaStream) {
			stream._polyOnEndedListener = setInterval(function () {
				// If stream has flag ended because of media tracks being stopped
        if (stream.ended) {
          clearInterval(stream._polyOnEndedListener);

          // trigger that it has ended
          if (typeof stream.onended === 'function') {
            var eventPayload = returnEventPayloadFn(stream);
            eventPayload.type = 'ended';
            stream.onended(eventPayload);
          }
        }

        if (typeof stream.recordedTime === 'undefined') {
          stream.recordedTime = 0;
        }

        if (stream.recordedTime === stream.currentTime) {
          clearInterval(stream._polyOnEndedListener);

          stream.ended = true;

          // trigger that it has ended
          if (typeof stream.onended === 'function') {
            var eventPayload = returnEventPayloadFn(stream);
            eventPayload.type = 'ended';
            stream.onended(eventPayload);
          }

        } else {
          stream.recordedTime = stream.currentTime;
        }
			}, 1000);

		} else {
			/**
			 * Stores the attached video element with the existing MediaStream
			 * This loops every second.
			 * - This only exists in Firefox browsers.
			 * @attribute _polyOnEndedListenerObj
			 * @type DOM
			 * @private
			 * @optional
			 * @for MediaStream
			 * @since 0.10.6
			 */
			// Use a video to attach to check if stream has ended
	    var video = document.createElement('video');

			video._polyOnEndedListener = setInterval(function () {
	      // If stream has flag ended because of media tracks being stopped
	      if (stream.ended) {
	        clearInterval(video._polyOnEndedListener);

	        // trigger that it has ended
	        if (typeof stream.onended === 'function') {
	        	var eventPayload = returnEventPayloadFn(stream);
	        	eventPayload.type = 'ended';
	          stream.onended(eventPayload);
	        }
	      }

	      // Check if mozSrcObject is not empty
	      if (typeof video.mozSrcObject === 'object' &&
	          video.mozSrcObject !== null) {

	        if (video.mozSrcObject.ended === true) {
	          clearInterval(video._polyOnEndedListener);

	          stream.ended = true;

	          // trigger that it has ended
	          if (typeof stream.onended === 'function') {
	            var eventPayload = returnEventPayloadFn(stream);
		        	eventPayload.type = 'ended';
		          stream.onended(eventPayload);
	          }
	        }
	      }
	    }, 1000);

	    // Bind the video element to MediaStream object
	    stream._polyOnEndedListenerObj = video;

	    window.attachMediaStream(video, stream);
		}
	};

	window.getUserMedia = function (constraints, successCb, failureCb) {

		navigator.mozGetUserMedia(constraints, function (stream) {
			polyfillMediaStream(stream);

			successCb(stream);

		}, failureCb);
	};

	window.attachMediaStream = function (element, stream) {
    // If there's an element used for checking stream stop
    // for an instance remote MediaStream for firefox
    // reattachmediastream instead
    if (typeof stream._polyOnEndedListenerObj !== 'undefined' &&
      stream instanceof LocalMediaStream === false) {
      window.reattachMediaStream(element, bind._polyOnEndedListenerObj);

    // LocalMediaStream
    } else {
      console.log('Attaching media stream');
    	element.mozSrcObject = stream;
    }
  };

// Chrome / Opera MediaStream
} else if (navigator.webkitGetUserMedia) {

	polyfillRTCPeerConnection = function (stream) {

		stream.onended = null;

		stream.onaddtrack = null;

		stream.onremovetrack = null;

		stream.onunsupported = null;


		(function () {
			var i, j;

			var audioTracks = stream.getAudioTracks();
	    var videoTracks = stream.getVideoTracks();

	    // Check for all tracks if ended
	    for (i = 0; i < audioTracks.length; i += 1) {
	      polyfillMediaStreamTrack( audioTracks[i] );
	    }

	    for (j = 0; j < videoTracks.length; j += 1) {
	      polyfillMediaStreamTrack( videoTracks[j] );
	    }
		})();

		stream.polystop = function () {
			stream.stop();
		};

		stream.polyaddTrack = function (track) {
			try {
				stream.addTrack(track);
			} catch (error) {
				// trigger that it has ended
        if (typeof stream.onunsupported === 'function') {
          var eventPayload = returnEventPayloadFn(stream);
          eventPayload.type = 'unsupported';
          eventPayload.error = error;
          eventPayload.feature = 'addTrack';
          stream.onunsupported(eventPayload);
        }
			}
		};

		stream.polygetTrackById = stream.getTrackById;

		stream.polyremoveTrack = function (track) {
			try {
				stream.removeTrack(track);
			} catch (error) {
				// trigger that it has ended
        if (typeof stream.onunsupported === 'function') {
          var eventPayload = returnEventPayloadFn(stream);
          eventPayload.type = 'unsupported';
          eventPayload.error = error;
          eventPayload.feature = 'removeTrack';
          stream.onunsupported(eventPayload);
        }
			}
		};

		stream.polygetAudioTracks = stream.getAudioTracks;

		stream.polygetVideoTracks = stream.getVideoTracks;
	};

	window.getUserMedia = function (constraints, successCb, failureCb) {
		navigator.webkitGetUserMedia(constraints, function (stream) {

			polyfillMediaStream(stream);

			successCb(stream);
		}, failureCb);

	};

// Safari MediaStream
} else {

	polyfillRTCPeerConnection = function (stream) {

		/**
		 * Stores the store Id to store MediaStreamTrack functions.
		 * - This only exists in Safari / IE (Plugin-enabled) browsers.
		 * @attribute _polyStoreId
		 * @type String
		 * @optional
		 * @private
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream._polyStoreId = (new Date()).getTime().toString();

		stream.ended = typeof stream.ended === 'boolean' ? stream.ended : false;

		stream.onended = null;

		stream.onaddtrack = null;

		stream.onremovetrack = null;

		stream.onunsupported = null;

		(function () {
			var i, j;

			var audioTracks = stream.getAudioTracks();
	    var videoTracks = stream.getVideoTracks();

	    var outputAudioTracks = [];
	    var outputVideoTracks = [];

	    // Check for all tracks if ended
	    for (i = 0; i < audioTracks.length; i += 1) {
	      var track = polyfillMediaStreamTrack( audioTracks[i] );
	      outputAudioTracks.push(track);
	    }

	    for (j = 0; j < videoTracks.length; j += 1) {
	      var track = polyfillMediaStreamTrack( videoTracks[j] );
	      outputVideoTracks.push(track);
	    }

	    storePolyfillMediaStreamTracks[stream._polyStoreId] = {
	    	audio: outputAudioTracks,
	    	video: outputVideoTracks
	    };
		})();

		stream.polystop = function () {
			stream.stop();

			var i, j;

			var outputAudioTracks = storePolyfillMediaStreamTracks[stream._polyStoreId].audio;
			var outputVideoTracks = storePolyfillMediaStreamTracks[stream._polyStoreId].video;

	    // Check for all tracks if ended
	    for (i = 0; i < outputAudioTracks.length; i += 1) {
	    	var track = outputAudioTracks[i];
	      track.ended = true;

	      if (typeof track.onended === 'function') {
	      	var eventPayload = returnEventPayloadFn(track);
          eventPayload.type = 'ended';

          if (typeof track.onended === 'function') {
          	track.onended(eventPayload);
          }
	      }
	    }

	    for (j = 0; j < outputVideoTracks.length; j += 1) {
	      var track = outputVideoTracks[j];
	      track.ended = true;

	      if (typeof track.onended === 'function') {
	      	var eventPayload = returnEventPayloadFn(track);
          eventPayload.type = 'ended';

          if (typeof track.onended === 'function') {
          	track.onended(eventPayload);
          }
	      }
	    }
		};

		stream.polyaddTrack = function (track) {
			try {
				stream.addTrack(track);
			} catch (error) {
				// trigger that it has ended
        if (typeof stream.onunsupported === 'function') {
          var eventPayload = returnEventPayloadFn(stream);
          eventPayload.type = 'unsupported';
          eventPayload.error = error;
          eventPayload.feature = 'addTrack';
          stream.onunsupported(eventPayload);
        }
			}
		};

		stream.polygetTrackById = function (trackId) {
			var i, j;

			var outputAudioTracks = storePolyfillMediaStreamTracks[stream._polyStoreId].audio;
			var outputVideoTracks = storePolyfillMediaStreamTracks[stream._polyStoreId].video;

	    // Check for all tracks if ended
	    for (i = 0; i < outputAudioTracks.length; i += 1) {
	    	if (outputAudioTracks[i].id === trackId) {
	      	return outputAudioTracks[i];
	      }
	    }

	    for (j = 0; j < outputVideoTracks.length; j += 1) {
	      if (outputVideoTracks[j].id === trackId) {
	      	return outputVideoTracks[j];
	      }
	    }

	    return null;
		};

		stream.polyremoveTrack = function (track) {
			try {
				stream.removeTrack(track);
			} catch (error) {
				// trigger that it has ended
        if (typeof stream.onunsupported === 'function') {
          var eventPayload = returnEventPayloadFn(stream);
          eventPayload.type = 'unsupported';
          eventPayload.error = error;
          eventPayload.feature = 'removeTrack';
          stream.onunsupported(eventPayload);
        }
			}
		};

		stream.polygetAudioTracks = function () {
			return storePolyfillMediaStreamTracks[stream._polyStoreId].audio;
		};

		stream.polygetVideoTracks = function () {
			return storePolyfillMediaStreamTracks[stream._polyStoreId].video;
		};
	};

	window.getUserMedia = function (constraints, successCb, failureCb) {
		navigator.getUserMedia(constraints, function(stream) {

      polyfillMediaStream(stream);

     	successCb(stream);
    }, failureCb);
  };
}