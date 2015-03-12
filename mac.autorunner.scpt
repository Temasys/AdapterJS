
repeat
	set safariExists to false

	try
	    tell application "Safari" to get application file id "bundle.id.here"
	    set safariExists to true
	on error
	    set safariExists to false
	end try
  if (exists application "Safari") then
    if application "Safari" is running then
	    tell application "System Events" to tell process "Safari"
	      set frontmost to true
				keystroke return
	    end tell
	   end if
  end if
  if (exists application "Opera") then
    if application "Opera" is running then
	    tell application "System Events" to tell process "Opera"
	      set frontmost to true
				keystroke return
	    end tell
	  end if
  end if
  delay 1
end repeat