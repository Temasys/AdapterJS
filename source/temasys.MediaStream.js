// Polyfill all MediaStream objects
var polyfillMediaStream = null;

// Firefox MediaStream
if (navigator.mozGetUserMedia) {

	/**
	 * The polyfilled MediaStream class.
	 * @class MediaStream
	 * @since 0.10.5
	 */
	polyfillMediaStream = function (stream) {

		/**
		 * The MediaStream object id.
		 * @attribute id
		 * @type String
		 * @readOnly
		 * @for MediaStream
		 * @since 0.10.6
		 */
		try {
			stream.id = stream.id || (new Date()).getTime().toString();
		} catch (error) {
			console.warn('Unable to polyfill MediaStream.id');
		}

		/**
		 * The flag that indicates if a MediaStream object has ended.
		 * @attribute ended
		 * @type Boolean
		 * @readOnly
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream.ended = typeof stream.ended === 'boolean' ? stream.ended : false;

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


		var polyEndedEmitter = function () {
			// set the ended as true
			stream.ended = true;

			// trigger that it has ended
      if (typeof stream.onended === 'function') {
        stream.onended({
        	type: 'ended',
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
			  });
      }
		};

		var polyTrackEndedEmitter = function (track) {
			// set the ended as true
			track.ended = true;

			// trigger that it has ended
      if (typeof track.onended === 'function') {
        track.onended({
        	type: 'ended',
			  	bubbles: false,
			  	cancelBubble: false,
			  	cancelable: false,
			  	currentTarget: track,
			  	defaultPrevented: false,
			  	eventPhase: 0,
			  	returnValue: true,
			  	srcElement: track,
			  	target: track,
			  	timeStamp: stream.currentTime || (new Date()).getTime()
			  });
      }
		};


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

				var i, j;

				var outputAudioTracks = stream.polygetAudioTracks();
				var outputVideoTracks = stream.polygetVideoTracks();

		    // Check for all tracks if ended
		    for (i = 0; i < outputAudioTracks.length; i += 1) {
		    	outputAudioTracks[i].ended = true;
		    }

		    for (j = 0; j < outputVideoTracks.length; j += 1) {
		      outputVideoTracks[j].ended = true;
		    }

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
				throw error;
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
			try {
				return stream.getTrackById(trackId);

			} catch (error) {
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
		  }
		};

		/**
		 * Gets all MediaStreamTracks from a MediaStreamTrack.
		 * @method polygetTracks
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream.polygetTracks = function (trackId) {
			try {
				return stream.getTracks();

			} catch (error) {
				var i, j;

				var audioTracks = stream.getAudioTracks();
		    var videoTracks = stream.getVideoTracks();

		    return audioTracks.concat(videoTracks);
		  }
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
				throw error;
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

	    var audioTracks = stream.getAudioTracks();
	    var videoTracks = stream.getVideoTracks();

	    var audioEnded = true;
	    var videoEnded = true;

	    // Check for all tracks if ended
	    for (i = 0; i < audioTracks.length; i += 1) {
	      if (audioTracks[i].ended !== true) {
	        audioEnded = false;
	        break;
	      }
	    }

	    for (j = 0; j < videoTracks.length; j += 1) {
	      if (videoTracks[j].ended !== true) {
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

          polyEndedEmitter();

          return;
        }

        if (typeof stream.recordedTime === 'undefined') {
          stream.recordedTime = 0;
        }

        if (stream.recordedTime === stream.currentTime) {
          clearInterval(stream._polyOnEndedListener);

          polyEndedEmitter();

          return;

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

	        polyEndedEmitter();

	        return;
	      }

	      // Check if mozSrcObject is not empty
	      if (typeof video.mozSrcObject === 'object' &&
	          video.mozSrcObject !== null) {

	        if (video.mozSrcObject.ended === true) {
	          clearInterval(video._polyOnEndedListener);

	          polyEndedEmitter();

	          return;
	        }
	      }
	    }, 1000);

	    // Bind the video element to MediaStream object
	    stream._polyOnEndedListenerObj = video;

	    window.attachMediaStream(video, stream);
		}
	};

	window.navigator.getUserMedia = function (constraints, successCb, failureCb) {

		window.navigator.mozGetUserMedia(constraints, function (stream) {
			polyfillMediaStream(stream);

			successCb(stream);

		}, failureCb);
	};

	window.getUserMedia = window.navigator.getUserMedia;

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

	polyfillMediaStream = function (stream) {

		stream.id = stream.id || (new Date()).getTime().toString();

		stream.ended = typeof stream.ended === 'boolean' ? stream.ended : false;

		stream.onended = null;

		stream.onaddtrack = null;

		stream.onremovetrack = null;


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
			var i, j;

			var audioTracks = stream.getAudioTracks();
		  var videoTracks = stream.getVideoTracks();

			try {
				stream.stop();

		    // Check for all tracks if ended
		    for (i = 0; i < audioTracks.length; i += 1) {
		    	if (audioTracks[i].readyState !== 'ended') {
		    		audioTracks[i].polystop();
		    	}
		    }

		    for (j = 0; j < videoTracks.length; j += 1) {
		      if (videoTracks[j].readyState !== 'ended') {
		    		videoTracks[j].polystop();
		    	}
		    }

			} catch (error) {

				// Check for all tracks if ended
		    for (i = 0; i < audioTracks.length; i += 1) {
		      audioTracks[i].polystop();
		    }

		    for (j = 0; j < videoTracks.length; j += 1) {
		      videoTracks[j].polystop();
		    }
			}
		};

		stream.polyaddTrack = function (track) {
			try {
				stream.addTrack(track);
			} catch (error) {
				throw error;
			}
		};

		stream.polygetTrackById = function (trackId) {
			try {
				return stream.getTrackById(trackId);

			} catch (err) {

				console.log(err);

				var i, j;

				var outputAudioTracks = polyStoreMediaTracks.audio;
				var outputVideoTracks = polyStoreMediaTracks.video;

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
		  }
		};

		stream.polygetTracks = function (trackId) {
			try {
				return stream.getTracks();

			} catch (error) {
				var i, j;

				var audioTracks = stream.getAudioTracks();
		    var videoTracks = stream.getVideoTracks();

		    return audioTracks.concat(videoTracks);
		  }
		};

		stream.polyremoveTrack = function (track) {
			try {
				stream.removeTrack(track);
			} catch (error) {
				throw error;
			}
		};

		stream.polygetAudioTracks = stream.getAudioTracks;

		stream.polygetVideoTracks = stream.getVideoTracks;
	};

	window.navigator.getUserMedia = function (constraints, successCb, failureCb) {
		navigator.webkitGetUserMedia(constraints, function (stream) {

			polyfillMediaStream(stream);

			successCb(stream);
		}, failureCb);

	};

	window.getUserMedia = window.navigator.getUserMedia;

// Safari MediaStream
} else {

	polyfillMediaStream = function (stream) {

		stream.id = stream.id || (new Date()).getTime().toString();

		stream.ended = typeof stream.ended === 'boolean' ? stream.ended : false;

		stream.onended = null;

		stream.onaddtrack = null;

		stream.onremovetrack = null;

		// MediaStreamTracks Polyfilled
		var polyStoreMediaTracks = {
			audio: [],
			video: []
		};

		(function () {
			var i, j;

			var audioTracks = stream.getAudioTracks();
	    var videoTracks = stream.getVideoTracks();

	    var outputAudioTracks = [];
	    var outputVideoTracks = [];

	    // Check for all tracks if ended
	    for (i = 0; i < audioTracks.length; i += 1) {
	      var audioTrack = polyfillMediaStreamTrack( audioTracks[i] );
	      outputAudioTracks.push(audioTrack);
	    }

	    for (j = 0; j < videoTracks.length; j += 1) {
	      var videoTrack = polyfillMediaStreamTrack( videoTracks[j] );
	      outputVideoTracks.push(videoTrack);
	    }

	    polyStoreMediaTracks.audio = outputAudioTracks;
	    polyStoreMediaTracks.video = outputVideoTracks;
		})();

		stream.polystop = function () {
			stream.stop();

			stream.ended = true;

			var i, j;

			var outputAudioTracks = polyStoreMediaTracks.audio;
			var outputVideoTracks = polyStoreMediaTracks.video;

	    // Check for all tracks if ended
	    for (i = 0; i < outputAudioTracks.length; i += 1) {
	    	outputAudioTracks[i].ended = true;
	    }

	    for (j = 0; j < outputVideoTracks.length; j += 1) {
	      outputVideoTracks[j].ended = true;
	    }
		};

		stream.polyaddTrack = function (track) {
			try {
				stream.addTrack(track);
			} catch (error) {
				throw error;
			}
		};

		stream.polygetTrackById = function (trackId) {
			// return stream.getTrackById(trackId);
			// for right now, because MediaStreamTrack does not allow overwrites,
			// we shall implement the polyfill to return the overwrite-able track.
			var i, j;

			var outputAudioTracks = polyStoreMediaTracks.audio;
			var outputVideoTracks = polyStoreMediaTracks.video;

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

		stream.polygetTracks = function (trackId) {
			var outputAudioTracks = polyStoreMediaTracks.audio;
			var outputVideoTracks = polyStoreMediaTracks.video;

	    return outputAudioTracks.concat(outputVideoTracks);
		};

		stream.polyremoveTrack = function (track) {
			try {
				stream.removeTrack(track);
			} catch (error) {
				throw error;
			}
		};

		stream.polygetAudioTracks = function () {
			return polyStoreMediaTracks.audio;
		};

		stream.polygetVideoTracks = function () {
			return polyStoreMediaTracks.video;
		};
	};

	var originalGUM = navigator.getUserMedia;

	window.navigator.getUserMedia = function (constraints, successCb, failureCb) {
		originalGUM(constraints, function(stream) {

      polyfillMediaStream(stream);

     	successCb(stream);
    }, failureCb);
  };

  window.getUserMedia = window.navigator.getUserMedia;
}