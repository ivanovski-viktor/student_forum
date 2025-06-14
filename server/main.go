package main

import (
	"github.com/gin-gonic/gin"
	"github.com/ivanovski-viktor/student_forum/server/db"
	"github.com/ivanovski-viktor/student_forum/server/routes"
)

func main() {
   db.InitDB()
   server := gin.Default()
   routes.RegisterRoutes(server)
   server.Run(":8080") //localhost:8080
}
