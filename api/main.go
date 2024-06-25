package main

import (
	"log"
	"thesis/core"
	"thesis/handlers"
	"thesis/repositories"
	"thesis/server"

	"time"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	db := repositories.NewDbRepo()
	srv := core.NewService(db)
	handler := handlers.NewHandler(srv)
	server := server.NewService(handler)

	time.Sleep(1 * time.Second)
	srv.InitFunction()

	server.Initialize()
}
