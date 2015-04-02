#!/bin/bash

open_new_tab() {
	pwd=`pwd`
	osascript -e "tell application \"Terminal\"" \
	-e "tell application \"System Events\" to keystroke \"t\" using {command down}" \
	-e "do script \"cd $pwd; clear; $1;\" in front window" \
	-e "end tell"
	> /dev/null
}

grunt test

# Start instances for auto-clicker (Mac)
open_new_tab "osascript tests/mac.watcher.scpt"

#for filename in tests/gen/*.js; do
#  node_modules/karma/bin/karma start $filename
#done

node_modules/karma/bin/karma start "tests/gen/chrome.MediaStream.prop.spec.js.conf.js"

# Kill all existing applescripts (Mac)
killall -e osascript

# Open and kill them all (Mac)
osascript -e 'open app "Safari"'
osascript -e 'quit app "Safari"'