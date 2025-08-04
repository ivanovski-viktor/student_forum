package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

var (
	JWTSecretKey string
	ServerAddr   string
	cldUrl       string
)

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, relying on system environment")
	}

	JWTSecretKey = os.Getenv("JWT_SECRET_KEY")
	ServerAddr = os.Getenv("SERVER")
	cldUrl = os.Getenv("CLOUDINARY_URL")

	if JWTSecretKey == "" || ServerAddr == "" || cldUrl == "" {
		log.Fatal("Missing one or more required environment variables")
	}
}
