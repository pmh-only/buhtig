package main

import "fmt"

func showDiffs() {
	_, _, storedHashs := loadRepositoryMetadata()
	ignoreFileList := loadIgnoreFileList()
	fileHashs := calculateFileHashs(ignoreFileList)

	fmt.Println()

	calculateFileDiff(fileHashs, storedHashs)
}
