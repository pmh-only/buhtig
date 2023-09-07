package main

import (
	"log"

	"github.com/manifoldco/promptui"
)

var DEFAULT_REGISTRY string = "tig.shutupandtakemy.codes"

func authRegistry() {
	registryDomain := promptRegistryDomain()

	checkRegistryHealth(registryDomain)

	loginId := promptLoginID()
	loginToken := promptLoginToken()

	retriveSessionTokenFromLogin(registryDomain, loginId, loginToken)
	log.Printf("Login successful.")

	saveCredential(registryDomain, loginId, loginToken)
	log.Printf("Credential saved.")
}

func promptRegistryDomain() string {
	prompt := promptui.Prompt{
		Label: "Registry Domain",
		HideEntered: true,
		AllowEdit: false,
		Default: DEFAULT_REGISTRY,
	}

	result, err := prompt.Run()
	if err != nil {
		log.Fatalln("Error: Registry domain not provided.")
	}

	return result
}

func promptLoginID() string {
	prompt := promptui.Prompt{
		Label: "Login ID",
		HideEntered: true,	
	}

	result, err := prompt.Run()
	if err != nil {
		log.Fatalln("Error: Login ID not provided.")
	}

	if len(result) < 3 {
		log.Fatalln("Error: Login ID cannot be shorter than 3 characters.")
	}

	return result
}

func promptLoginToken() string {
	prompt := promptui.Prompt{
		Label: "Login Token",
		HideEntered: true,
		Mask: '*',
	}

	result, err := prompt.Run()
	if err != nil {
		log.Fatalln("Error: Login token not provided.")
	}

	if len(result) != 30 {
		log.Fatalln("Error: Login token must be 30 characters. (you can create new one from dashboard.)")
	}

	return result
}
