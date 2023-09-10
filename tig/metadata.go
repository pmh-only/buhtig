package main

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
)

func loadIgnoreFileList() (ignoreFileList []string) {
	ignoreFileList = []string{}

	workingDirectory, err := os.Getwd()
	if err != nil {
		log.Fatalln("Error: Cannot get current working directory.")
	}

	rawIgnoreFileList, err := os.ReadFile(filepath.Join(workingDirectory, ".tignore"))
	if err != nil {
		log.Println(".tignore file not found. skip.")
		return
	}

	ignoreFileList = strings.Split(string(rawIgnoreFileList), "\n")
	return
}

func writeRepositoryMetadata(repositoryDirectory string, repositoryId int, rawFileHashs map[string]string) {
	repoId := []byte(fmt.Sprintf("%d", repositoryId))
	err := os.WriteFile(filepath.Join(repositoryDirectory, ".tig", "repoid"), repoId, 0660)
	if err != nil {
		log.Fatalln("Error: Failed to create metadata.")
	}

	fileHashs := ""
	for logical, hash := range rawFileHashs {
		fileHashs += fmt.Sprintf("%s %s\n", logical, hash)
	}

	err = os.WriteFile(filepath.Join(repositoryDirectory, ".tig", "hashs"), []byte(fileHashs), 0660)
	if err != nil {
		log.Fatalln("Error: Failed to create metadata.")
	}
}

func writeRepositoryHash(rawFileHashs map[string]string) {
	workingDirectory, err := os.Getwd()
	if err != nil {
		log.Fatalln("Error: Cannot get current working directory.")
	}

	fileHashs := ""
	for logical, hash := range rawFileHashs {
		fileHashs += fmt.Sprintf("%s %s\n", logical, hash)
	}

	err = os.WriteFile(filepath.Join(workingDirectory, ".tig", "hashs"), []byte(fileHashs), 0660)
	if err != nil {
		log.Fatalln("Error: Failed to create metadata.")
	}
}

func loadRepositoryMetadata() (repositoryDirectory string, repositoryId int, fileHashs map[string]string) {
	fileHashs = map[string]string{}

	repositoryDirectory, err := os.Getwd()
	if err != nil {
		log.Fatalln("Error: Cannot get current working directory.")
	}

	repoIdRaw, err := os.ReadFile(filepath.Join(repositoryDirectory, ".tig", "repoid"))
	if err != nil {
		log.Fatalln("Error: Failed to read repoid metadata. (Is this valid tig repository?)")
	}

	_, err = fmt.Sscanf(string(repoIdRaw[:]), "%d", &repositoryId)
	if err != nil {
		log.Fatalln("Error: Failed to read repoid metadata. metadata file has been corrupted.")
	}

	rawFileHashs, err := os.ReadFile(filepath.Join(repositoryDirectory, ".tig", "hashs"))
	if err != nil {
		log.Fatalln("Error: Failed to read repoid metadata. (Is this valid tig repository?)")
	}

	fileHashLines := strings.Split(string(rawFileHashs[:]), "\n")

	for _, fileHashLine := range fileHashLines {
		var logical, fileHash string
		_, err = fmt.Sscanf(fileHashLine, "%s %s", &logical, &fileHash)
		if err != nil {
			continue
		}

		fileHashs[logical] = fileHash
	}

	return
}
