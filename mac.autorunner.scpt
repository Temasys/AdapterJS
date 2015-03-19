repeat
	set started to false
	if application "Safari" is running then
		tell application "System Events" to tell process "Safari"
			set frontmost to true
			if started is false then
	    	delay 2
	    	set started to true
	    end if
	    keystroke return
	  end tell
  end if

  if application "Opera" is running then
    tell application "System Events" to tell process "Opera"
      if front window exists then
      	if exists (button "Allow" of front window) then
		        click (button "Allow" of front window)
		    end if
      end if
    end tell
  end if
  delay 1
end repeat