
function runTest{
	param($testDirectory="tests\gen\chrome.*");
	foreach($file in Get-ChildItem $testDirectory){
		karma start $file.fullName;
	}
}

function autoClick{
	cmd /c start powershell.exe -noexit -command "./autoclick.ps1" 
}

#grunt test;
#runTest;

autoClick;
