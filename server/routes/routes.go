package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/ivanovski-viktor/student_forum/server/middleware"
)

func RegisterRoutes(server *gin.Engine) {
	server.GET("/posts", getAllPosts)
	server.GET("/posts/:id", getPost)
	server.POST("/register", registerUser)
	server.POST("/login", loginUser)
	server.GET("/users/:id", getUser)

	// AUTH ROUTES
	auth := server.Group("/")
	auth.Use(middleware.Authenticate)
	auth.POST("/posts", createPost)
	auth.PUT("/posts/:id", updatePost)
	auth.DELETE("/posts/:id", deletePost)

}
