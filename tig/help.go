package main

import "log"

func showHelp() {
	log.Println("tig : the ultra-simple `git` clone project.")
	log.Println("\nSubcommands:")
	log.Println("\ttig auth")
	log.Println("\tLogin registry with id, accesskey.")
	log.Println("\n\ttig get <repository_id>")
	log.Println("\tCreate directory and download latest files from registry.")
	log.Println("\n\ttig down [commit_id]")
	log.Println("\tDownload latest or specific commit files from registry.")
	log.Println("\tWarning! this command will discard all uploaded changes.")
	log.Println("\n\ttig up")
	log.Println("\tCommit file changes and upload to registry")
	log.Println("\n\ttig files")
	log.Println("\tCalculate file changes.")
	log.Println("\n\ttig log")
	log.Println("\tShow commit histories")
	log.Println("\n\ttig help")
	log.Println("\tShow this message")
	log.Println()
}
