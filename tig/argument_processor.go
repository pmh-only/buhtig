package main

import (
	"os"
)

var subcommandFunctions map[string]func() = map[string]func(){}

func checkSubcommandProvided() bool {
	return len(os.Args) > 1
}

func loadSubcommandFunctions () {
	subcommandFunctions["help"] = showHelp
	subcommandFunctions["auth"] = authRegistry
	subcommandFunctions["init"] = initRepository
	subcommandFunctions["get"] = getRepositoryFiles
	subcommandFunctions["up"] = uploadChanges
	subcommandFunctions["files"] = showDiffs
	subcommandFunctions["log"] = showLogs
	subcommandFunctions["down"] = downloadSpecificCommit
}

func retriveSubcommandFunction () func() {
	return subcommandFunctions[os.Args[1]]
}
