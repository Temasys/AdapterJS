
function runTest{
	param($testDirectory="tests\gen\ie.*");
	foreach($file in Get-ChildItem $testDirectory){
		karma start $file.fullName;
	}
}

function autoClick{
	cmd /c start powershell.exe -noexit -command "./autoclick.ps1" 
}

grunt test --force;
runTest;

#autoClick;
