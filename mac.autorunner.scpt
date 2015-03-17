repeat
	if application "Safari" is running then
    tell application "System Events" to tell process "Safari"
      tell window 0
			  tell group 0
				  tell button "OK"
				  	perform action "AXPress"
				  end tell
			  end tell
		  end tell
    end tell
  end if

  if application "Opera" is running then
    tell application "System Events" to tell process "Opera"
      keystroke "return"
    end tell
  end if
  delay 1
end repeat