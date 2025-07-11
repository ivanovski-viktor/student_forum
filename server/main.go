package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/ivanovski-viktor/student_forum/server/db"
	"github.com/ivanovski-viktor/student_forum/server/routes"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found!")
	}

	db.InitDB()
	server := gin.Default()
	routes.RegisterRoutes(server)

	// set server in your .env file
	addr := os.Getenv("SERVER")
	if addr == "" {
		addr = ":8080" // fallback to default if not set
	}

	server.Run(addr)
}
