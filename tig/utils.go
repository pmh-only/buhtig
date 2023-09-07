package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/jmoiron/jsonq"
)

var MAGIC_STRING string = "think-manhandle-refrain-ought-sincerity"
var INSECURE_WARNING bool = true

func checkRegistryHealth(registryDomain string) {
	jq, err := createHTTPConnection("GET", registryDomain + "/api/healthz", "", nil)
	if err != nil {
		log.Fatalln("Registry health check failed. please run 'tig auth' again.")
	}

	success, err := jq.Bool("success")
	if err != nil {
		log.Fatalln("Registry health check failed. please run 'tig auth' again.")
	}

	magicString, err := jq.String("body", "magic")
	if err != nil {
		log.Fatalln("Registry health check failed. please run 'tig auth' again.")
	}

	if !success || magicString != MAGIC_STRING {
		log.Fatalln("Registry health check failed. please run 'tig auth' again.")
	}
}

func createHTTPConnection(method string, url string, sessionToken string, body io.Reader) (*jsonq.JsonQuery, error) {
	_, insecureMode := os.LookupEnv("INSECURE_REGISTRY")
	schema := "https://"

	if insecureMode {
		schema = "http://"

		if INSECURE_WARNING {
			log.Println("Warning! Insecure registry mode enabled. Please use for development purpose only.")
			INSECURE_WARNING = false
		}
	}

	client := &http.Client{}
	req, err := http.NewRequest(method, schema + url, body)
	if err != nil {
		return nil, err
	}

	req.Header.Set("User-Agent", "tig/" + MAGIC_STRING)

	if body != nil {
		req.Header.Set("Content-Type", "application/json")
	}

	if len(sessionToken) > 0 {
		req.AddCookie(&http.Cookie{
			Name: "SESSION_TOKEN",
			Value: sessionToken,
		})
	}

	res, err := client.Do(req)
	if err != nil {
		return nil, err
	}

	data := map[string]interface{}{}
	decoder := json.NewDecoder(res.Body)
	decoder.Decode(&data)

	jq := jsonq.NewQuery(data)

	message, err := jq.String("message")
	if err == nil {
		log.Printf("Registry message received: %s\n", message)
	}

	return jq, nil
}

func downloadHTTP(url string) (io.ReadCloser, error) {
	_, insecureMode := os.LookupEnv("INSECURE_REGISTRY")
	schema := "https://"

	if insecureMode {
		schema = "http://"

		if INSECURE_WARNING {
			log.Println("Warning! Insecure registry mode enabled. Please use for development purpose only.")
			INSECURE_WARNING = false
		}
	}

	client := &http.Client{}
	req, err := http.NewRequest("GET", schema + url, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("User-Agent", "tig/" + MAGIC_STRING)

	res, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	
	return res.Body, nil
}
