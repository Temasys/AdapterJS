repeat
	if application "Safari" is running then
		tell application "System Events" to tell process "npTemWebRTCPlugin (Safari Internet plug-in)"
			if window 1 exists then
        if exists (button "OK" of front window) then
          click (button "OK" of front window)
        end if
      end if
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
