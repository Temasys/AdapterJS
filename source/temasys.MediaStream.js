if (navigator.mozGetUserMedia) {

	LocalMediaStream.prototype._onendedListener = (function() {
	  var ref = this;

	  var checker = setInterval(function () {
	    if (typeof ref.recordedTime === 'undefined') {
	      ref.recordedTime = 0;
	    }

	    if (ref.recordedTime === ref.currentTime) {
	      clearInterval(checker);

	      ref.ended = true;

	      // trigger that it has ended
	      console.log('has ended');

	    } else {
	      ref.recordedTime = ref.currentTime;
	    }

	  }, 1000);

	  return checker;
	})();

} else if (navigator.webkitGetUserMedia) {


} else {

}