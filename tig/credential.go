package main

import (
	"bytes"
	"encoding/json"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/coyove/jsonbuilder"
	"github.com/jmoiron/jsonq"
)

func saveCredential (registryDomain, loginId, loginToken string) {

	body := jsonbuilder.	
		Object().
		Set("registryDomain", registryDomain).
		Set("loginId", loginId).
		Set("loginToken", loginToken).
		MarshalPretty()

	bodyByte := []byte(body)
	homeDir, err := os.UserHomeDir()
	if err != nil {
		homeDir = "/"
	}

	err = os.WriteFile(filepath.Join(homeDir, ".tigcred"), bodyByte, 0600)
	if err != nil {
		log.Fatalln("Error: ", err)
	}
}

func loadCredential () (registryDomain, loginId, loginToken string) {
	log.Println("Read credential information from ~/.tigcred")

	homeDir, err := os.UserHomeDir()
	if err != nil {
		homeDir = "/"
	}

	bodyByte, err := os.ReadFile(filepath.Join(homeDir, ".tigcred"))
	if err != nil {
		log.Fatalln("Error: Cannot found credential informations. please login with 'tig auth' command")
	}

	data := map[string]interface{}{}
	decoder := json.NewDecoder(bytes.NewReader(bodyByte))
	decoder.Decode(&data)

	jq := jsonq.NewQuery(data)

	registryDomain, err = jq.String("registryDomain")
	if err != nil {
		log.Fatalln("Error: Credential informations have been corrupted. please re-login with 'tig auth' command")
	}

	loginId, err = jq.String("loginId")
	if err != nil {
		log.Fatalln("Error: Credential informations have been corrupted. please re-login with 'tig auth' command")
	}

	loginToken, err = jq.String("loginToken")
	if err != nil {
		log.Fatalln("Error: Credential informations have been corrupted. please re-login with 'tig auth' command")
	}

	return
}

func retriveSessionTokenFromLogin(registryDomain, loginId, loginToken string) string {
	body := jsonbuilder.
		Object().
		Set("login", loginId).
		Set("secret", loginToken).
		Marshal()

	bodyReader := strings.NewReader(body)

	jq, err := createHTTPConnection("POST", registryDomain+"/api/auth/by-token", "", bodyReader)
	if err != nil {
		log.Panic(err)
	}

	success, err := jq.Bool("success")
	if err != nil {
		log.Fatalln("Error: User credential invalid. double check your ID/Token.")
	}

	token, err := jq.String("body", "token")
	if err != nil {
		log.Fatalln("Error: User credential invalid. double check your ID/Token.")
	}

	if !success {
		log.Fatalln("Error: User credential invalid. double check your ID/Token.")
	}

	return token
}
