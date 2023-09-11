package main

import (
	"crypto/sha256"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"strconv"
)

func downloadSpecificCommit() {
	registryDomain, _, _ := loadCredential()
	repositoryDirectory, repositoryId, oldFileHashs := loadRepositoryMetadata()

	commitId, isRestricted := getCommitId()
	repositoryFiles := getRepositoryFileListByCondition(registryDomain, repositoryId, isRestricted, commitId)

	fileHashs := downloadFileFromList(registryDomain, repositoryDirectory, repositoryFiles)

	beDiscardFiles := calculateCreatedFile(oldFileHashs, fileHashs)
	discardChanges(repositoryDirectory, beDiscardFiles)
	
	writeRepositoryMetadata(repositoryDirectory, repositoryId, fileHashs)
	log.Printf("Download commit #%d successful\n", commitId)
}

func getCommitId() (int, bool) {
	if len(os.Args) < 3 {
		return 0, false
	}

	result, err := strconv.Atoi(os.Args[2])
	if err != nil {
		return 0, false
	}

	return result, true
}

func getRepositoryFileListByCondition(registryDomain string, repositoryId int, isRestricted bool, commitId int) map[string]string {
	if isRestricted {
		return getRepositoryCommitFileList(registryDomain, repositoryId, commitId)
	}

	return getRepositoryFileList(registryDomain, repositoryId)
}

func getRepositoryCommitFileList(registryDomain string, repositoryId int, commitId int) (files map[string]string) {
	files = map[string]string{}

	jq, err := createHTTPConnection("GET", fmt.Sprintf("%s/api/repos/%d/files?commitId=%d", registryDomain, repositoryId, commitId), "", nil)
	if err != nil {
		log.Panic(err)
	}

	rawFiles, err := jq.ArrayOfObjects("body")
	if err != nil {
		log.Fatalln("Error: Failed to retrive file list.")
	}

	for _, v := range rawFiles {
		files[v["logical"].(string)] = v["physical"].(string)
	}

	return
}

func downloadFileFromList (registryDomain, repositoryDirectory string, files map[string]string) (fileHashs map[string]string) {
	fileHashs = map[string]string{}

	for logical, physical := range files {
		data, err := downloadHTTP(registryDomain + "/objects/" + physical)
		if err != nil {
			log.Fatalf("Error: Failed to retrive file data: %s", logical)
		}

		dataBytes, err := io.ReadAll(data)
		if err != nil {
			log.Fatalf("Error: Failed to retrive file data: %s", logical)
		}

		_ = os.MkdirAll(filepath.Dir(filepath.Join(repositoryDirectory, logical)), 0770)
		err = os.WriteFile(filepath.Join(repositoryDirectory, logical), dataBytes, 0660)
		if err != nil {
			log.Fatalf("Error: Failed to save file data: %s", logical)
		}

		hasher := sha256.New()
		hasher.Write(dataBytes)

		hash := fmt.Sprintf("%x", hasher.Sum(nil))
		fileHashs[logical] = hash

		log.Printf("Downloaded: %s -> %s (%s)\n", logical, physical, hash)
	}
	
	return
}

func discardChanges(repositoryDirectory string, files []string) {
	for _, filePath := range files {
		err := os.Remove(filepath.Join(repositoryDirectory, filePath))
		if err != nil {
			log.Printf("%s: failed to discard changes.", filePath)
		}
	}
}
