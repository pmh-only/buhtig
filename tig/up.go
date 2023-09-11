package main

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"mime/multipart"
	"net/http"
	"net/textproto"
	"os"
	"path/filepath"
	"strings"

	"github.com/coyove/jsonbuilder"
	"github.com/jmoiron/jsonq"
	"github.com/manifoldco/promptui"
)

func uploadChanges() {
	registryDomain, loginId, loginToken := loadCredential()
	sessionToken := retriveSessionTokenFromLogin(registryDomain, loginId, loginToken)

	_, repositoryId, storedHashs := loadRepositoryMetadata()
	
	ignoreFileList := loadIgnoreFileList()
	fileHashs := calculateFileHashs(ignoreFileList)
	
	latestCommitFiles := getRepositoryFileList(registryDomain, repositoryId)
	fmt.Println()
	
	createdFiles, updatedFiles, deletedFiles := calculateFileDiff(fileHashs, storedHashs)
	additionalDeletedFiles := findAdditionalDeletedFiles(fileHashs, latestCommitFiles)

	commitMessage := promptCommitMessage()

	writeCommit(
		registryDomain,
		sessionToken,
		repositoryId,
		commitMessage,
		createdFiles,
		updatedFiles,
		deletedFiles,
		additionalDeletedFiles)

	writeRepositoryHash(fileHashs)
	log.Println("Write commit and upload successful.")
}

func promptCommitMessage() string {
	prompt := promptui.Prompt{
		Label:       "Commit message (can be empty)",
		HideEntered: true,
	}

	result, err := prompt.Run()
	if err != nil {
		log.Fatalln("Error: Commit message not provided.")
	}

	return result
}

func findAdditionalDeletedFiles(fileHashs, latestCommitFiles map[string]string) (additionalDeletedFiles []string) {
	for logical := range latestCommitFiles {
		if _, ok := fileHashs[logical]; !ok {
			additionalDeletedFiles = append(additionalDeletedFiles, logical)
		}
	}

	return
}

func writeCommit(registryDomain, sessionToken string, repositoryId int, commitMessage string, createdFiles, updatedFiles, rawDeletedFiles, additionalDeletedFiles []string) {
	upsertedFiles := append(createdFiles, updatedFiles...)
	workingDirectory, err := os.Getwd()

	if err != nil {
		log.Fatalln("Error: Cannot get current working directory.")
	}

	body := &bytes.Buffer{}
	bodyWriter := multipart.NewWriter(body)
	deletedFiles := jsonbuilder.Array()

	for _, deletedFile := range append(rawDeletedFiles, additionalDeletedFiles...) {
		deletedFiles.Push(deletedFile)
	}

	bodyWriter.WriteField("message", commitMessage)
	bodyWriter.WriteField("deletedFiles", deletedFiles.Marshal())

	for _, logical := range upsertedFiles {
		encodedFilename := base64.StdEncoding.EncodeToString([]byte(logical))
		encodedFilename = strings.ReplaceAll(encodedFilename, "/", ".")
		
		header := make(textproto.MIMEHeader)
		header.Set("Content-Type", "application/octet-stream")
		header.Set("Content-Disposition",
			fmt.Sprintf(`form-data; name="files"; filename="%s"`, encodedFilename))
		
		fileWriter, err := bodyWriter.CreatePart(header)
		if err != nil {
			log.Printf("%s: Failed to write form data. skip.", logical)
		}

		fileReader, err := os.ReadFile(filepath.Join(workingDirectory, logical))
		if err != nil {
			log.Printf("%s: Failed to read file data. skip.", logical)
		}

		fileWriter.Write(fileReader)
	}

	bodyWriter.Close()

	_, insecureMode := os.LookupEnv("INSECURE_REGISTRY")
	schema := "https"

	if insecureMode {
		schema = "http"
	}

	client := &http.Client{}
	req, err := http.NewRequest("POST", fmt.Sprintf("%s://%s/api/repos/%d/commits", schema, registryDomain, repositoryId), body)
	if err != nil {
		log.Panic(err)
	}

	req.Header.Set("User-Agent", "tig/" + MAGIC_STRING)
	req.Header.Set("Content-Type", bodyWriter.FormDataContentType())
	req.AddCookie(&http.Cookie{
		Name: "SESSION_TOKEN",
		Value: sessionToken,
	})

	res, err := client.Do(req)
	if err != nil {
		log.Panic(err)
	}

	data := map[string]interface{}{}
	decoder := json.NewDecoder(res.Body)
	decoder.Decode(&data)

	jq := jsonq.NewQuery(data)
	
	message, err := jq.String("message")
	if err == nil {
		log.Printf("Registry message received: %s\n", message)
	}

	success, err := jq.Bool("success")
	if err != nil || !success {
		log.Fatalln("Error: failed to upload.")
	}
}
