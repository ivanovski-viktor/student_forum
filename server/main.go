package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
	"github.com/ivanovski-viktor/student_forum/server/config"
	_ "github.com/ivanovski-viktor/student_forum/server/config"
	"github.com/ivanovski-viktor/student_forum/server/db"
	"github.com/ivanovski-viktor/student_forum/server/routes"
	"github.com/ivanovski-viktor/student_forum/server/validation"
)

func main() {
	// validation
	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
		err := v.RegisterValidation("strongpwd", validation.StrongPasswordValidator)
		if err != nil {
			log.Fatalf("Failed to register strong password validator: %v", err)
		}
	}

	db.InitDB()
	server := gin.Default()
	routes.RegisterRoutes(server)

	// set server in your .env file
	addr := config.ServerAddr

	if addr == "" {
		addr = ":8080" // fallback to default if not set
	}

	server.Run(addr)
}
