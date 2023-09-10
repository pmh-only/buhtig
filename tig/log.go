package main

import (
	"fmt"
	"log"
)

func showLogs() {
	registryDomain, _, _ := loadCredential()
	repositoryId, _ := loadRepositoryMetadata()

	fetchCommitLogs(registryDomain, repositoryId)
}

func fetchCommitLogs(registryDomain string, repositoryId int) {
	jq, err := createHTTPConnection("GET", fmt.Sprintf("%s/api/repos/%d/commits", registryDomain, repositoryId), "", nil)
	if err != nil {
		log.Panic(err)
	}

	if success, err := jq.Bool("success"); !success || err != nil {
		log.Fatalln("Error: failed to fetch commit logs")
	}

	commits, err := jq.ArrayOfObjects("body")
	if err != nil {
		log.Fatalln("Error: failed to fetch commit logs")
	}

	for _, commit := range commits {
		log.Printf("-\n#%.0f %s\n%s\nby %s (#%.0f)\n", 
			commit["id"],
			commit["message"],
			commit["createdAt"],
			commit["user"].(map[string]interface{})["login"],
			commit["user"].(map[string]interface{})["id"])
	}
}
