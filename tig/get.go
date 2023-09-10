package main

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strconv"
)

func getRepositoryFiles() {
	registryDomain, _, _ := loadCredential()

	repositoryId := getRepositoryIdArgument()
	repositoryName := getRepositoryName(registryDomain, repositoryId)
	repositoryDirectory := createRepositoryDirectory(repositoryName)
	repositoryFiles := getRepositoryFileList(registryDomain, repositoryId)

	fileHashs := downloadFileFromList(registryDomain, repositoryDirectory, repositoryFiles)
	
	writeRepositoryMetadata(repositoryDirectory, repositoryId, fileHashs)
	log.Printf("Download repository successful: %s\n", repositoryDirectory)
}

func getRepositoryIdArgument() int {
	if len(os.Args) < 3 {
		log.Fatalln("Please provide repository id. Usage: tig get <repository_id>")
	}

	repositoryId, err := strconv.Atoi(os.Args[2])
	if err != nil {
		log.Fatalf("Error: Repository Id `%s` is not integer\n", os.Args[2])
	}

	return repositoryId
}

func getRepositoryName(registryDomain string, repositoryId int) string {
	jq, err := createHTTPConnection("GET", fmt.Sprintf("%s/api/repos/%d", registryDomain, repositoryId), "", nil)
	if err != nil {
		log.Panic(err)
	}
	
	success, err := jq.Bool("success")
	if err != nil || !success {
		log.Fatalf("Error: Repository Id `%d` not found.\n", repositoryId)
	}

	name, err := jq.String("body", "name")
	if err != nil {
		log.Fatalln("Error: Cannot get repositry name.")
	}

	return name
}

func createRepositoryDirectory(repositoryName string) string {
	workingDirectory, err := os.Getwd()
	if err != nil {
		log.Fatalln("Error: Cannot get current working directory.")
	}

	directoryPath := filepath.Join(workingDirectory, repositoryName)
	fileInfo, _ := os.Stat(directoryPath)
	
	if fileInfo != nil && fileInfo.IsDir() {
		log.Fatalf("Error: Directory \"%s\" is already exists/permission denied. (did you mean tig down?)", repositoryName)
	}

	err = os.Mkdir(directoryPath, 0770)
	if err != nil {
		log.Fatalf("Error: Failed to create directory \"%s\".\n", repositoryName)
	}

	err = os.Mkdir(filepath.Join(directoryPath, ".tig"), 0770)
	if err != nil {
		log.Fatalln("Error: Failed to create metadata directory.")
	}

	return directoryPath
}

func getRepositoryFileList(registryDomain string, repositoryId int) (files map[string]string) {
	files = map[string]string{}

	jq, err := createHTTPConnection("GET", fmt.Sprintf("%s/api/repos/%d/files", registryDomain, repositoryId), "", nil)
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
