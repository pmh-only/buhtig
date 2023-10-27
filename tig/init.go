package main

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/coyove/jsonbuilder"
	"github.com/manifoldco/promptui"
)

func initRepository() {
	registryDomain, loginId, loginToken := loadCredential()
	sessionToken := retriveSessionTokenFromLogin(registryDomain, loginId, loginToken)

	repositoryName, repositoryDescription := promptRepositoryInfo()

	repositoryDirectory, err := os.Getwd()
	if err != nil {
		log.Fatalln("Error: Cannot get current working directory.")
	}

	createMetadataDirectory(repositoryDirectory)
	repositoryId := createRepository(registryDomain, sessionToken, repositoryName, repositoryDescription)

	writeRepositoryMetadata(repositoryDirectory, repositoryId, map[string]string{})
}

func promptRepositoryInfo() (string, string) {
	promptName := promptui.Prompt{
		Label:       "Repository name",
		HideEntered: true,
	}

	resultName, err := promptName.Run()
	if err != nil {
		log.Fatalln("Error: Repository name not provided.")
	}


	promptDescription := promptui.Prompt{
		Label:       "Repository description",
		HideEntered: true,
	}

	resultDescription, err := promptDescription.Run()
	if err != nil {
		log.Fatalln("Error: Repository description not provided.")
	}

	return resultName, resultDescription
}

func createMetadataDirectory(repositoryDirectory string) {
	err := os.Mkdir(filepath.Join(repositoryDirectory, ".tig"), 0770)
	if err != nil {
		log.Fatalln("Error: Failed to create metadata directory.")
	}
}

func createRepository(registryDomain, sessionToken, repositoryName, repositoryDescription string) int {
	body := jsonbuilder.	
		Object().
		Set("name", repositoryName).
		Set("description", repositoryDescription).
		Marshal()

	bodyReader := strings.NewReader(body)

	jq, err := createHTTPConnection("POST", fmt.Sprintf("%s/api/repos", registryDomain), sessionToken, bodyReader)
	if err != nil {
		log.Panic(err)
	}

	success, err := jq.Bool("success")
	if err != nil {
		log.Fatalln("Error: Repository creation failed.")
	}

	id, err := jq.Int("body", "id")
	if err != nil {
		log.Fatalln("Error: Repository creation failed.")
	}

	if !success {
		log.Fatalln("Error: Repository creation failed.")
	}

	return id
}
