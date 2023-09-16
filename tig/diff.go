package main

import (
	"crypto/sha256"
	"fmt"
	"io/fs"
	"log"
	"os"
	"path/filepath"
	"regexp"
	"strings"

	"golang.org/x/exp/slices"
)

func calculateFileHashs(ignoreFileList []string) (fileHashs map[string]string) {
	fileHashs = map[string]string{}

	workingDirectory, err := os.Getwd()
	if err != nil {
		log.Fatalln("Error: Cannot get current working directory.")
	}

	err = filepath.Walk(workingDirectory, func(path string, info fs.FileInfo, err error) error {
		simplifiedPath := strings.ReplaceAll(path, workingDirectory, "")
		simplifiedPath = strings.ReplaceAll(simplifiedPath, "\\", "/")
		
		if !strings.HasPrefix(simplifiedPath, "/") {
			simplifiedPath = "/" + simplifiedPath
		}

		if err != nil {
			log.Printf("%s: failed to read file info. skip.", simplifiedPath)
			return nil
		}

		if info.IsDir() {
			log.Printf("%s: is a directory. skip.", simplifiedPath)
			return nil
		}

		ignoredIndex := slices.IndexFunc(ignoreFileList, func (ignoreFile string) bool {
			ignoreFile = strings.TrimSpace(ignoreFile)

			if len(ignoreFile) < 1 {
				return false
			}

			matchs, err := regexp.MatchString(ignoreFile, simplifiedPath)
			if err != nil {
				return false
			}

			return matchs
		})

		if ignoredIndex > -1 {
			log.Printf("%s: found on '.tignore'. skip.", simplifiedPath)
			return nil
		}

		if !strings.Contains(path, ".tignore") && strings.Contains(path, ".tig") {
			log.Printf("%s: contains '.tig' on path. skip.", simplifiedPath)
			return nil
		}

		bytes, err := os.ReadFile(path)
		if err != nil {
			log.Printf("%s: failed to read file data (maybe permission denied). skip.", simplifiedPath)
			return nil
		}

		hasher := sha256.New()
		hasher.Write(bytes)

		hash := fmt.Sprintf("%x", hasher.Sum(nil))
		fileHashs[simplifiedPath] = hash

		return nil
	})
	
	if err != nil {
		log.Fatalln("Error: Cannot calculate file hashs. filesystem corrupted or permission denied.")
	}

	return
}

func calculateFileDiff(fileHashs, storedHashs map[string]string) (createdFile, updatedFile, deletedFile []string) {
	createdFile = calculateCreatedFile(fileHashs, storedHashs, false)
	updatedFile = calculateUpdatedFile(fileHashs, storedHashs)
	deletedFile = calculateDeletedFile(fileHashs, storedHashs)

	return
}

func calculateCreatedFile(fileHashs, storedHashs map[string]string, isSlient bool) (createdFile []string) {
	createdFile = []string{}

	for logical := range fileHashs {
		if _, ok := storedHashs[logical]; ok {
			continue
		}

		createdFile = append(createdFile, logical)

		if isSlient {
			continue
		}

		fmt.Printf("%s: file created.\n", logical)
	}

	return
}

func calculateUpdatedFile(fileHashs, storedHashs map[string]string) (updatedFile []string) {
	updatedFile = []string{}

	for logical, fileHash := range fileHashs {
		if _, ok := storedHashs[logical]; !ok {
			continue
		}

		if fileHash == storedHashs[logical] {
			continue
		}

		updatedFile = append(updatedFile, logical)
		fmt.Printf("%s: file updated.\n", logical)
	}

	return
}

func calculateDeletedFile(fileHashs, storedHashs map[string]string) (deletedFile []string) {
	deletedFile = []string{}

	for logical := range storedHashs {
		if _, ok := fileHashs[logical]; ok {
			continue
		}

		deletedFile = append(deletedFile, logical)
		fmt.Printf("%s: file deleted.\n", logical)
	}

	return
}
