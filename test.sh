grunt jshint;
browserify tests/*.js | testling -x "open -a /Applications/Google\ Chrome.app";
