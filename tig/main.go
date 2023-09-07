package main

import (
	"log"
	"os"
)

func init() {
	log.SetFlags(0)
}

func main() {
	isSubcommandProvided := checkSubcommandProvided()
	if !isSubcommandProvided {
		showHelp()
		log.Fatalln("Subcommand not provided. Exit.")	
	}

	loadSubcommandFunctions()

	subcommandFn := retriveSubcommandFunction()
	if subcommandFn == nil {
		showHelp()
		log.Fatalf("Unknown subcommand \"%s\". Panic.\n", os.Args[1])
	}

	subcommandFn()
}
