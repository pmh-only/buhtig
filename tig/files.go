package main

import "fmt"

func showDiffs() {
	_, storedHashs := loadRepositoryMetadata()
	ignoreFileList := loadIgnoreFileList()
	fileHashs := calculateFileHashs(ignoreFileList)

	fmt.Println()

	calculateFileDiff(fileHashs, storedHashs)
}
