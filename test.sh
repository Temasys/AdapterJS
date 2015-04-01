open_new_tab() {
	pwd=`pwd`
	osascript -e "tell application \"Terminal\"" \
	-e "tell application \"System Events\" to keystroke \"t\" using {command down}" \
	-e "do script \"cd $pwd; clear; $1;\" in front window" \
	-e "end tell"
	> /dev/null
}

grunt dev

# Start instances for auto-clicker (Mac)
open_new_tab "osascript mac.autorunner.scpt"

node_modules/karma/bin/karma start karma.conf.js

# Kill all existing applescripts (Mac)
killall -e osascript

# Open and kill them all (Mac)
osascript -e 'open app "Safari"'
osascript -e 'quit app "Safari"'