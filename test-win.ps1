
function runTest{
	param($testDirectory="tests\gen\chrome.*");
	foreach($file in Get-ChildItem $testDirectory){
		karma start $file.fullName;
	}
}

grunt test;
runTest;
